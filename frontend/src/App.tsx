import { useState } from "react"
import UploadZone from "./components/UploadZone"
import ChatBox from "./components/ChatBox"
import AnswerCard from "./components/AnswerCard"
import { uploadPDF, askQuestion } from "./api"
import type { Message } from "./types"

export default function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isAsking, setIsAsking] = useState(false)
  const [uploadMessage, setUploadMessage] = useState("")

  const handleUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const response = await uploadPDF(file)
      setUploadMessage(response.message)
    } catch (error) {
      setUploadMessage("Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleAsk = async (question: string) => {
    setIsAsking(true)
    try {
      const response = await askQuestion(question)
      const newMessage: Message = {
        question,
        answer: response.answer,
        sources: response.sources
      }
      setMessages((prev) => [...prev, newMessage])
    } catch (error) {
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">
      <header className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-gray-300">RAG Document Q&A</span>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <aside className="w-full md:w-64 lg:w-72 p-4 border-r border-gray-700">
          <UploadZone
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadMessage={uploadMessage}
          />
        </aside>

        <section className="flex-1 p-4 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((msg, i) => (
              <AnswerCard key={i} message={msg} />
            ))}

            {isAsking && (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-800 border border-emerald-500
                      flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="flex gap-1 bg-gray-800 border border-gray-700
                      px-4 py-3 rounded-2xl rounded-tl-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:150ms]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}
          </div>
          <ChatBox onAsk={handleAsk} isAsking={isAsking} />
        </section>
      </main>

      <footer className="border-t border-gray-700 px-4 py-2.5 flex items-center justify-center gap-3">
        <span className="text-xs text-gray-500">
          Developed by <span className="text-gray-300 font-medium">John Kris Gellado</span>
        </span>
        <span className="text-gray-700">·</span>

        <a href="https://github.com/Jkris0917"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
          </svg>
          GitHub
        </a>
        <span className="text-gray-700">·</span>

        <a href="https://johnkris-portfolio.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-gray-500 hover:text-emerald-400 transition-colors duration-200 flex items-center gap-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          Portfolio
        </a>
      </footer>
    </div>
  )
}