import { FileIcon, UploadIcon } from "lucide-react";

type Props = {
    onUpload: (file: File) => void
    isUploading: boolean
    uploadMessage: string
}

export default function UploadZone({ onUpload, isUploading, uploadMessage }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">document</p>
            <label className="border-2 border-dashed border-gray-700 hover:border-emerald-500 transition-colors rounded-xl p-6 flex flex-col items-center gap-3 cursor-pointer group">
                <input
                    type="file" className="hidden" accept=".pdf"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            onUpload(file);
                        }
                    }}
                    disabled={isUploading}
                />
                <UploadIcon className="w-8 h-8 text-gray-500 group-hover:text-emerald-500 transition-colors" />
                <span className="text-sm text-gray-500 group-hover:text-emerald-500 transition-colors">Click to upload PDF</span>
            </label>

            {/* Uploading state */}
            {isUploading && (
                <div className="flex items-center gap-2 text-sm text-emerald-400 
                  bg-emerald-950 border border-emerald-800 
                  rounded-lg px-3 py-2">
                    <div className="w-3 h-3 rounded-full border-2 border-emerald-400 
                    border-t-transparent animate-spin" />
                    Processing PDF...
                </div>
            )}

            {/* Success state */}
            {!isUploading && uploadMessage && (
                <div className="flex items-center gap-2 text-sm text-emerald-400
                  bg-emerald-950 border border-emerald-800
                  rounded-lg px-3 py-2">
                    <FileIcon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{uploadMessage}</span>
                </div>
            )}
        </div>
    );
}