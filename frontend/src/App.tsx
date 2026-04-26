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
    </div>
  )
}