import type { AskResponse, UploadResponse } from "./types";

const BASE_URL = "http://127.0.0.1:8000"

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