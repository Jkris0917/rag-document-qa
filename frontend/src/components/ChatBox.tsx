import { SendIcon } from "lucide-react"
import { useState } from "react"

type Props = {
    onAsk: (question: string) => void
    isAsking: boolean
}

export default function ChatBox({ onAsk, isAsking }: Props) {

    const [question, setQuestion] = useState("")
    return (
        <div className="border-t border-gray-800 p-4 flex gap-3 items-center">
            <input
                type="text"
                placeholder="Ask a question about your documents..."
                disabled={isAsking}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        if (!question.trim()) return
                        onAsk(question)
                        setQuestion("")
                    }
                }}
                className="flex-1 bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 rounded-xl px-4 py-2.5 outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
            <button
                onClick={() => {
                    if (!question.trim()) return
                    onAsk(question)
                    setQuestion("")
                }}
                disabled={isAsking}
                className="w-9 h-9 rounded-xl bg-emerald-600
                   hover:bg-emerald-500 transition-colors
                   flex items-center justify-center
                   disabled:opacity-40 disabled:cursor-not-allowed"
            >
                {isAsking
                    ? <div className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    : <SendIcon className="w-4 h-4 text-white" />
                }
            </button>
        </div>
    );
}