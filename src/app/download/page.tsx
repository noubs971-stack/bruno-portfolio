'use client'

import { motion } from 'framer-motion'
import { Download, FileArchive, CheckCircle } from 'lucide-react'

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full p-8 rounded-2xl bg-gradient-to-br from-[#12121a] to-[#0d0d14] border border-[#1e1e2e] text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-green-500 flex items-center justify-center"
        >
          <FileArchive className="w-10 h-10 text-[#0a0a0f]" />
        </motion.div>

        <h1 className="text-2xl font-bold text-white mb-2">Portfolio Bruno Bondron</h1>
        <p className="text-gray-400 mb-6">Fichier ZIP complet avec les 190 frames de l'avatar animé</p>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>7.4 MB • Prêt à télécharger</span>
        </div>

        <motion.a
          href="/api/download-zip"
          download="bruno-portfolio.zip"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-green-500 text-[#0a0a0f] font-bold text-lg"
        >
          <Download className="w-6 h-6" />
          Télécharger le ZIP
        </motion.a>

        <p className="text-xs text-gray-600 mt-6">
          Une fois téléchargé, désarchivez et uploadez sur GitHub
        </p>
      </motion.div>
    </div>
  )
}
