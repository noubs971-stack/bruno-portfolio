import { NextRequest, NextResponse } from 'next/server';

// Store conversations in memory (use database in production)
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// Ollama configuration - runs locally on port 11434 by default
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

// Detect if the query needs web search (real-time info)
function needsWebSearch(message: string): boolean {
  const keywords = [
    'résultat', 'score', 'match', 'psg', 'chelsea', 'football', 'foot',
    'aujourd\'hui', 'hier', 'news', 'actualité', 'météo', 'prix', 'cours',
    'qui a gagné', 'combien', 'quelle heure', 'date', 'dernier', 'récent',
    'matchs', 'joué', 'a joué', 'buts', 'classement', 'weather', 'température',
    'prix du', 'cours du', 'action', 'bourse', 'crypto', 'bitcoin', 'ethereum'
  ];
  
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()));
}

// Free web search using DuckDuckGo (no API key needed!)
async function searchWebDuckDuckGo(query: string): Promise<string> {
  try {
    const searchUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    
    const response = await fetch(searchUrl);
    const data = await response.json();
    
    let results = '';
    
    // Get abstract if available
    if (data.Abstract) {
      results += `${data.Abstract}\n`;
    }
    
    // Get related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      results += '\nSources:\n';
      for (const topic of data.RelatedTopics.slice(0, 3)) {
        if (topic.Text) {
          results += `- ${topic.Text}\n`;
        }
      }
    }
    
    return results || "Aucun résultat trouvé.";
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return "Erreur lors de la recherche web.";
  }
}

// Alternative: Serper.dev free tier (100 searches/month)
async function searchWebSerper(query: string): Promise<string> {
  try {
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': process.env.SERPER_API_KEY || '' // Free at serper.dev
      },
      body: JSON.stringify({ q: query })
    });

    if (!response.ok) {
      throw new Error('Serper API error');
    }

    const data = await response.json();
    
    if (data.organic && data.organic.length > 0) {
      return data.organic
        .slice(0, 3)
        .map((r: { title: string; snippet: string }) => `${r.title}: ${r.snippet}`)
        .join('\n');
    }
    
    return "Aucun résultat trouvé.";
  } catch (error) {
    console.error('Serper search error:', error);
    return "";
  }
}

// Combined web search
async function searchWeb(query: string): Promise<string> {
  // Try DuckDuckGo first (completely free, no API key)
  const ddgResults = await searchWebDuckDuckGo(query);
  
  if (ddgResults && ddgResults.length > 50) {
    return ddgResults;
  }
  
  // Fallback to Serper if configured
  if (process.env.SERPER_API_KEY) {
    const serperResults = await searchWebSerper(query);
    if (serperResults) {
      return serperResults;
    }
  }
  
  return ddgResults;
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, message, model } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const useModel = model || OLLAMA_MODEL;

    // System prompt for Bruno's AI assistant
    const systemPrompt = `Tu es l'assistant IA de Bruno Bondron, développeur SaaS & Solutions IA pour PME.

Tu représentes Bruno sur son portfolio. Tu dois:
- Être amical, professionnel et enthousiaste
- Parler de Bruno et de ses services
- Expliquer ses compétences: IA, automatisation n8n, Docker, développement SaaS, agents vocaux
- Mentionner ses projets: plateforme d'automatisation PME, agent vocal IA, publication automatisée, infrastructure IA conteneurisée
- Inciter les visiteurs à contacter Bruno via Noubs971@gmail.com
- Répondre en français de manière concise et engageante
- Utiliser des emojis avec modération pour rendre la conversation plus vivante

Si on te pose une question hors sujet, réponds quand même de manière utile.

Fais des réponses courtes et percutantes (2-4 phrases max).`;

    // Check if we need web search
    let webContext = '';
    if (needsWebSearch(message)) {
      console.log('Web search triggered for:', message);
      webContext = await searchWeb(message);
    }

    // Get or create conversation history
    let history = conversations.get(sessionId) || [];
    
    // Build messages array for Ollama
    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    // Add web context if available
    if (webContext) {
      messages.push({
        role: 'system',
        content: `Informations récentes du web:\n${webContext}\n\nUtilise ces informations pour répondre précisément à la question de l'utilisateur.`
      });
    }

    // Add conversation history
    history.forEach(h => {
      messages.push({ role: h.role === 'user' ? 'user' : 'assistant', content: h.content });
    });

    // Add current message
    messages.push({ role: 'user', content: message });

    // Call Ollama API
    const response = await fetch(`${OLLAMA_API_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: useModel,
        messages,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama API error:', errorText);
      return NextResponse.json({
        success: false,
        error: 'Ollama non disponible. Assurez-vous qu\'Ollama est lancé (ollama serve)',
        hint: 'Exécutez: ollama serve && ollama pull ' + useModel
      }, { status: 500 });
    }

    const data = await response.json();
    const aiResponse = data.message?.content || "Désolé, je n'ai pas pu générer de réponse.";

    // Add messages to history
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: aiResponse });

    // Keep only last 20 messages to avoid memory issues
    if (history.length > 20) {
      history = history.slice(-20);
    }

    // Save updated history
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageCount: history.length,
      model: useModel,
      webSearchUsed: !!webContext
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      success: false,
      error: 'Impossible de se connecter à Ollama. Lancez "ollama serve" dans un terminal.',
      hint: 'Installation: curl -fsSL https://ollama.com/install.sh | sh && ollama pull llama3.2'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  
  if (sessionId) {
    conversations.delete(sessionId);
  }
  
  return NextResponse.json({ success: true, message: 'Conversation cleared' });
}

// Endpoint pour lister les modèles disponibles
export async function GET() {
  try {
    const response = await fetch(`${OLLAMA_API_URL}/api/tags`);
    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      models: data.models || [],
      currentModel: OLLAMA_MODEL,
      ollamaUrl: OLLAMA_API_URL,
      status: 'connected'
    });
  } catch {
    return NextResponse.json({
      success: false,
      error: 'Ollama non disponible',
      hint: 'Lancez: ollama serve',
      ollamaUrl: OLLAMA_API_URL,
      status: 'disconnected'
    }, { status: 503 });
  }
}
