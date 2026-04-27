import { useState } from "react"
import UploadZone from "./components/UploadZone"
import ChatBox from "./components/ChatBox"
import AnswerCard from "./components/AnswerCard"
import { uploadPDF, askQuestionStream } from "./api"
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

    const newMessage: Message = { question, answer: "", sources: [] }
    setMessages(prev => [...prev, newMessage])

    try {
      await askQuestionStream(
        question,
        (token) => {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              answer: updated[updated.length - 1].answer + token
            }
            return updated
          })
        },
        (sources) => {
          setMessages(prev => {
            const updated = [...prev]
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              sources
            }
            return updated
          })
        }
      )
    } catch (error) {
      console.error(error)
    } finally {
      setIsAsking(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950">

      {/* Top bar */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-sm font-medium text-gray-300">RAG Document Q&A</span>
        </div>
        <span className="text-xs text-gray-600 hidden md:block">
          Upload a PDF · Ask anything
        </span>
      </header>

      {/* Main layout */}
      <main className="flex flex-1 overflow-hidden flex-col md:flex-row">

        {/* Sidebar */}
        <aside className="w-full md:w-64 lg:w-72 p-4 border-b md:border-b-0 md:border-r border-gray-800 flex flex-col gap-4">
          <UploadZone
            onUpload={handleUpload}
            isUploading={isUploading}
            uploadMessage={uploadMessage}
          />

          {/* Tips */}
          {messages.length === 0 && !uploadMessage && (
            <div className="mt-4 flex flex-col gap-2">
              <p className="text-xs font-medium text-gray-600 uppercase tracking-wider">
                How it works
              </p>
              {[
                "Upload any PDF document",
                "Ask questions in natural language",
                "Get answers with page citations",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-4 h-4 rounded-full bg-emerald-950 border border-emerald-800
                                  flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-gray-500 leading-relaxed">{tip}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Chat section */}
        <section className="flex-1 flex flex-col overflow-hidden">

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-800
                              flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <p className="text-sm text-gray-500 text-center max-w-xs">
                Upload a PDF from the sidebar then ask a question to get started
              </p>
            </div>
          )}

          {/* Messages */}
          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <AnswerCard key={i} message={msg} />
              ))}

              {/* Typing indicator */}
              {isAsking && messages[messages.length - 1]?.answer === "" && (
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
          )}

          {/* Input */}
          <ChatBox onAsk={handleAsk} isAsking={isAsking} />

          {/* Footer */}
          <footer className="px-5 py-2 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              RAG Document Q&A · Built with FastAPI, ChromaDB & Groq ·{" "}
              <span className="hidden sm:inline">Created by John Kris</span>
            </p>
            <p className="text-xs text-gray-600 mt-1 space-x-4">
              <a href="https://github.com/jkris0917/rag-document-qa"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-500 transition-colors"
              >
                GitHub
              </a>
              <a href="https://johnkris-portfolio.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 hover:text-emerald-500 transition-colors"
              >
                My Portfolio
              </a>
            </p>
          </footer>

        </section>
      </main>
    </div >
  )
}