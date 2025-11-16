
import React, { useState, useRef } from 'react';
import { Icon } from './common/Icon';
import { Card } from './common/Card';

export interface DocumentInput {
  documentText?: string;
  documentImage?: {
    base64: string;
    mimeType: string;
  };
}
interface FileUploadProps {
  onDocumentSubmit: (input: DocumentInput) => void;
  isLoading: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDocumentSubmit, isLoading }) => {
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      
      // Reset states
      setDocumentText('');
      setImagePreview(null);
      setImageMimeType(null);

      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImagePreview(result);
          setImageMimeType(file.type);
        };
        reader.readAsDataURL(file);
      } else { // Assume text file for other types
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          setDocumentText(text);
        };
        reader.onerror = () => {
          setDocumentText(`Error reading file: ${file.name}`);
        };
        reader.readAsText(file);
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setDocumentText(text);
      // Clear image if pasting text
      setImagePreview(null);
      setImageMimeType(null);
      setFileName('Pasted from clipboard');
    } catch (err) {
      console.error('Failed to read clipboard contents: ', err);
      alert("Could not paste from clipboard. Please paste manually into the text area.");
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const input: DocumentInput = {};
    if (documentText) {
        input.documentText = documentText;
    } else if (imagePreview && imageMimeType) {
        input.documentImage = { base64: imagePreview, mimeType: imageMimeType };
    }
    onDocumentSubmit(input);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Icon name="upload" />
                <span>Upload Document</span>
            </button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".txt,.md,.png,.jpg,.jpeg,.webp"
            />
            <button
                type="button"
                onClick={handlePaste}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary hover:text-primary transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Icon name="clipboard" />
                <span>Paste Report Text</span>
            </button>
        </div>

        <div>
            <label htmlFor="document-text" className="block text-sm font-medium text-gray-700 mb-1">
                Document Content {fileName && `(${fileName})`}
            </label>
            {imagePreview ? (
                <div className="mt-1 p-2 border border-gray-300 rounded-lg flex justify-center items-center bg-gray-50">
                    <img src={imagePreview} alt="Medical document preview" className="max-h-96 w-auto rounded-md object-contain" />
                </div>
            ) : (
                <textarea
                  id="document-text"
                  rows={10}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary transition"
                  placeholder="Your document text will appear here after uploading or pasting..."
                  value={documentText}
                  onChange={(e) => setDocumentText(e.target.value)}
                />
            )}
        </div>
        
        <div className="flex justify-end">
            <button
              type="submit"
              disabled={isLoading || (!documentText && !imagePreview)}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Document'}
            </button>
        </div>
      </form>
    </Card>
  );
};
