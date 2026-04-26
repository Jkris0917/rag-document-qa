import type { Message } from "../types"

type Props = {
    message: Message
}

export default function AnswerCard({ message }: Props) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <div className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-2xl rounded-br-sm max-w-xs lg:max-w-md">
                    {message.question}
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-gray-800 border border-emerald-500
                  flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>
                    <span className="text-xs text-gray-500">RAG Assistant</span>
                </div>
                <div className="bg-gray-800 border border-gray-700 text-gray-200 text-sm leading-relaxed px-4 py-3 rounded-2xl rounded-tl-sm max-w-xl">
                    {message.answer}
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                {message.sources.map((page) => (
                    <span key={page} className="text-xs px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                        Page {page}
                    </span>
                ))}
            </div>
        </div>
    );
}