
export type Message = {
    question: string;
    answer: string;
    sources: number[];
}

export type AskResponse = {
    answer: string;
    sources: number[];
}

export type UploadResponse = {
    message: string;
}