import { NextRequest, NextResponse } from 'next/server';

// Store conversations in memory
const conversations = new Map<string, Array<{ role: string; content: string }>>();

// Mode démo - fonctionne sans API (parfait pour portfolio!)
export async function POST(request: NextRequest) {
  try {
    const { sessionId, message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Réponses intelligentes basées sur les mots-clés
    const lowerMsg = message.toLowerCase();
    let response = '';

    if (lowerMsg.includes('bonjour') || lowerMsg.includes('salut') || lowerMsg.includes('hello')) {
      response = "👋 Salut ! Je suis l'assistant IA de Bruno Bondron. Comment puis-je vous aider ?";
    } 
    else if (lowerMsg.includes('bruno') || lowerMsg.includes('qui es-tu') || lowerMsg.includes('présente')) {
      response = "👨‍💻 **Bruno Bondron** - Développeur SaaS & Solutions IA pour PME\n\n🔧 **Compétences :** IA, automatisation n8n, Docker, agents vocaux\n🚀 **Projets :** Plateforme automatisation PME, agent vocal IA, publication auto\n📧 **Contact :** Noubs971@gmail.com\n\n💡 Il aide les PME à gagner du temps avec l'IA !";
    }
    else if (lowerMsg.includes('service') || lowerMsg.includes('propose') || lowerMsg.includes('offre')) {
      response = "🛠️ **Services de Bruno :**\n\n1️⃣ **Automatisations n8n** - Gagnez des heures par semaine\n2️⃣ **Agents IA vocaux** - Répondent 24/7\n3️⃣ **Chatbots intelligents** - Support client automatisé\n4️⃣ **SaaS sur mesure** - Outils métier personnalisés\n\n📧 Contactez-le : Noubs971@gmail.com";
    }
    else if (lowerMsg.includes('tarif') || lowerMsg.includes('prix') || lowerMsg.includes('coût') || lowerMsg.includes('combien')) {
      response = "💰 **Tarification sur mesure**\n\nChaque projet est unique ! Bruno propose des devis personnalisés selon vos besoins.\n\n📧 Demandez un devis gratuit : Noubs971@gmail.com\n\n🎯 *Premier échange offert pour comprendre vos besoins !*";
    }
    else if (lowerMsg.includes('contact') || lowerMsg.includes('email') || lowerMsg.includes('joindre')) {
      response = "📬 **Contactez Bruno :**\n\n📧 Email : Noubs971@gmail.com\n💼 LinkedIn : Bruno Bondron\n\n🚀 Réponse rapide garantie !";
    }
    else if (lowerMsg.includes('projet') || lowerMsg.includes('réalisation') || lowerMsg.includes('portfolio')) {
      response = "🚀 **Projets de Bruno :**\n\n1️⃣ **Plateforme d'automatisation PME** - CRM, leads, publications auto\n2️⃣ **Agent vocal IA** - Assistant téléphonique intelligent\n3️⃣ **Outil de publication auto** - Multi-plateformes en 1 clic\n4️⃣ **Infrastructure IA Docker** - Déploiement scalable\n\n💡 *Chaque projet résout un vrai problème métier.*";
    }
    else if (lowerMsg.includes('ia') || lowerMsg.includes('intelligence artificielle') || lowerMsg.includes('automatisation')) {
      response = "🤖 **L'IA au service de votre entreprise :**\n\n- ✅ **Gain de temps** : Automatisez les tâches répétitives\n- ✅ **Disponibilité 24/7** : Agents IA qui ne dorment jamais\n- ✅ **Économies** : Moins de ressources humaines sur les tâches simples\n- ✅ **Scalabilité** : Gérez plus de clients sans plus d'efforts\n\n📧 Bruno peut vous aider : Noubs971@gmail.com";
    }
    else if (lowerMsg.includes('docker') || lowerMsg.includes('déploiement') || lowerMsg.includes('serveur')) {
      response = "🐳 **Expert Docker & Infrastructure :**\n\nBruno maîtrise le déploiement d'environnements IA scalables :\n- Conteneurisation des applications\n- Orchestration multi-services\n- Déploiement sur VPS\n- Isolation sécurisée\n\n📧 Besoin d'infrastructure ? Noubs971@gmail.com";
    }
    else if (lowerMsg.includes('n8n') || lowerMsg.includes('workflow') || lowerMsg.includes('zapier')) {
      response = "⚡ **Automatisation avec n8n :**\n\nn8n est l'outil préféré de Bruno pour créer des workflows automatisés :\n- Connexion entre vos outils (Gmail, Sheets, CRM...)\n- Zaps intelligents avec logique conditionnelle\n- Déclencheurs automatiques\n- Intégration IA\n\n📧 Automatisez votre business : Noubs971@gmail.com";
    }
    else if (lowerMsg.includes('agent vocal') || lowerMsg.includes('téléphone') || lowerMsg.includes('répondre')) {
      response = "📞 **Agent Vocal IA :**\n\nUn assistant téléphonique intelligent qui :\n- Répond aux appels 24/7\n- Qualifie les prospects\n- Prend des rendez-vous\n- Redirige vers un humain si besoin\n\n📧 Votre secrétaire IA vous attend : Noubs971@gmail.com";
    }
    else if (lowerMsg.includes('merci') || lowerMsg.includes('au revoir') || lowerMsg.includes('ciao')) {
      response = "👋 Au plaisir ! N'hésitez pas à contacter Bruno pour vos projets IA :\n\n📧 Noubs971@gmail.com\n\nBonne journée ! 🌟";
    }
    else {
      response = "🤔 Je n'ai pas bien compris votre question.\n\nVous pouvez me demander :\n- \"Qui est Bruno ?\"\n- \"Quels services proposez-vous ?\"\n- \"Quels sont vos projets ?\"\n- \"Comment vous contacter ?\"\n\nOu contactez directement Bruno : Noubs971@gmail.com 📧";
    }

    // Get/update history
    let history = conversations.get(sessionId) || [];
    history.push({ role: 'user', content: message });
    history.push({ role: 'assistant', content: response });
    if (history.length > 20) history = history.slice(-20);
    conversations.set(sessionId, history);

    return NextResponse.json({
      success: true,
      response,
      messageCount: history.length,
      provider: 'Demo',
      isDemo: true
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({
      success: false,
      error: 'Une erreur est survenue'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');
  if (sessionId) conversations.delete(sessionId);
  return NextResponse.json({ success: true });
}

export async function GET() {
  return NextResponse.json({
    success: true,
    provider: 'Demo',
    configured: true,
    isDemo: true,
    hint: null
  });
}
