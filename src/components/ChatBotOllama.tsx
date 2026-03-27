'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2, Server, Cloud, Settings } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

type BackendType = 'cloud' | 'ollama'

export function ChatBotOllama() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "👋 Salut ! Je suis l'assistant IA de Bruno. Comment puis-je vous aider aujourd'hui ?"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)
  const [backend, setBackend] = useState<BackendType>('ollama') // Ollama par défaut (gratuit)
  const [showSettings, setShowSettings] = useState(false)
  const [ollamaModel, setOllamaModel] = useState('llama3.2')
  const [availableModels, setAvailableModels] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Check available Ollama models
  useEffect(() => {
    const checkOllamaModels = async () => {
      try {
        const response = await fetch('/api/chat-ollama')
        const data = await response.json()
        if (data.success && data.models) {
          setAvailableModels(data.models.map((m: { name: string }) => m.name))
          if (data.models.length > 0) {
            setOllamaModel(data.models[0].name)
          }
        }
      } catch {
        console.log('Ollama not available')
      }
    }
    
    if (isOpen && backend === 'ollama') {
      checkOllamaModels()
    }
  }, [isOpen, backend])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const endpoint = backend === 'cloud' ? '/api/chat' : '/api/chat-ollama'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId, 
          message: userMessage,
          model: backend === 'ollama' ? ollamaModel : undefined
        })
      })

      const data = await response.json()

      if (data.success && data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.error || "Désolé, une erreur s'est produite. N'hésitez pas à contacter Bruno directement à Noubs971@gmail.com 📧"
        }])
      }
    } catch {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: backend === 'ollama' 
          ? "⚠️ Ollama n'est pas disponible. Lancez 'ollama serve' dans un terminal."
          : "Désolé, je ne peux pas répondre pour le moment. Contactez Bruno à Noubs971@gmail.com 📧"
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickQuestions = [
    "Que fait Bruno ?",
    "Vos services IA",
    "Me contacter"
  ]

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center shadow-lg hover:shadow-cyan-500/25 transition-shadow"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen 
            ? '0 0 0 0 rgba(0, 245, 255, 0)' 
            : ['0 0 20px rgba(0, 245, 255, 0.3)', '0 0 40px rgba(0, 255, 136, 0.3)', '0 0 20px rgba(0, 245, 255, 0.3)']
        }}
        transition={{
          boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-[#0a0a0f]" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="w-6 h-6 text-[#0a0a0f]" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification badge */}
      {!isOpen && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-16 right-6 z-50 w-5 h-5 rounded-full bg-green-500 border-2 border-[#0a0a0f] flex items-center justify-center"
        >
          <span className="text-[10px] font-bold text-[#0a0a0f]">1</span>
        </motion.span>
      )}

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl overflow-hidden shadow-2xl"
            style={{
              background: 'linear-gradient(180deg, #12121a 0%, #0a0a0f 100%)',
              border: '1px solid #1e1e2e',
            }}
          >
            {/* Header */}
            <div className="p-4 border-b border-[#1e1e2e] bg-gradient-to-r from-cyan-500/10 to-green-500/10">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center"
                >
                  <Bot className="w-5 h-5 text-[#0a0a0f]" />
                </motion.div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white">Assistant IA</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-400">
                      {backend === 'cloud' ? 'Cloud API' : `Ollama (${ollamaModel})`}
                    </span>
                  </div>
                </div>
                <motion.button
                  onClick={() => setShowSettings(!showSettings)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg hover:bg-[#1e1e2e] transition-colors"
                >
                  <Settings className="w-4 h-4 text-gray-400" />
                </motion.button>
                <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>

              {/* Settings panel */}
              <AnimatePresence>
                {showSettings && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-[#1e1e2e]"
                  >
                    <p className="text-xs text-gray-500 mb-2">Backend IA :</p>
                    <div className="flex gap-2">
                      <motion.button
                        onClick={() => setBackend('cloud')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          backend === 'cloud'
                            ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-400'
                            : 'bg-[#1e1e2e] border border-[#2e2e3e] text-gray-400'
                        }`}
                      >
                        <Cloud className="w-4 h-4" />
                        Cloud
                      </motion.button>
                      <motion.button
                        onClick={() => setBackend('ollama')}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                          backend === 'ollama'
                            ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                            : 'bg-[#1e1e2e] border border-[#2e2e3e] text-gray-400'
                        }`}
                      >
                        <Server className="w-4 h-4" />
                        Ollama
                      </motion.button>
                    </div>
                    
                    {backend === 'ollama' && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Modèle :</p>
                        <select
                          value={ollamaModel}
                          onChange={(e) => setOllamaModel(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e] text-white text-sm focus:border-cyan-500 focus:outline-none"
                        >
                          {availableModels.length > 0 ? (
                            availableModels.map(model => (
                              <option key={model} value={model}>{model}</option>
                            ))
                          ) : (
                            <>
                              <option value="llama3.2">llama3.2</option>
                              <option value="llama3.1">llama3.1</option>
                              <option value="mistral">mistral</option>
                              <option value="codellama">codellama</option>
                              <option value="phi3">phi3</option>
                            </>
                          )}
                        </select>
                        <p className="text-xs text-gray-600 mt-1">
                          💡 Lancez "ollama pull {ollamaModel}" pour télécharger le modèle
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 space-y-4 scrollbar-thin">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-3.5 h-3.5 text-[#0a0a0f]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-cyan-500 to-green-500 text-[#0a0a0f] rounded-br-md'
                        : 'bg-[#1e1e2e] text-gray-200 rounded-bl-md'
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-[#1e1e2e] flex items-center justify-center flex-shrink-0 border border-[#2e2e3e]">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-3.5 h-3.5 text-[#0a0a0f]" />
                  </div>
                  <div className="bg-[#1e1e2e] px-4 py-3 rounded-2xl rounded-bl-md">
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                      <span className="text-xs text-gray-400">
                        {backend === 'cloud' ? 'Réflexion...' : 'Ollama génère...'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            {messages.length === 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Questions rapides :</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <motion.button
                      key={index}
                      onClick={() => {
                        setInput(question)
                        inputRef.current?.focus()
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-3 py-1.5 text-xs rounded-full bg-[#1e1e2e] text-gray-300 border border-[#2e2e3e] hover:border-cyan-500/50 transition-colors"
                    >
                      {question}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <div className="p-4 border-t border-[#1e1e2e]">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Posez votre question..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white text-sm placeholder-gray-500 focus:border-cyan-500 focus:outline-none transition-colors disabled:opacity-50"
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send className="w-4 h-4 text-[#0a0a0f]" />
                </motion.button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-[10px] text-gray-600">
                  {backend === 'cloud' 
                    ? '☁️ Propulsé par Cloud API' 
                    : '🖥️ Propulsé par Ollama (local)'}
                </p>
                <p className="text-[10px] text-gray-600">
                  🤖 Assistant de Bruno Bondron
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
