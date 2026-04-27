import type { AskResponse, UploadResponse } from "./types";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export async function uploadPDF(file: File): Promise<UploadResponse> {

    const form = new FormData();
    form.append("file", file);
    const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        body: form
    });
    return response.json();
}

export async function askQuestion(question: string): Promise<AskResponse> {

    const response = await fetch(`${BASE_URL}/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
    });
    return response.json();
}

export async function askQuestionStream(
  question: string,
  onToken: (token: string) => void,
  onSources: (sources: number[]) => void
): Promise<void> {
  const response = await fetch(`${BASE_URL}/ask-stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  })

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)

    if (chunk.includes("__SOURCES__")) {
      // parse sources from the marker
      const sourcesStr = chunk.split("__SOURCES__")[1]
      try {
        const sources = JSON.parse(sourcesStr.replace(/'/g, '"'))
        onSources(sources)
      } catch {}
    } else {
      onToken(chunk)
    }
  }
}