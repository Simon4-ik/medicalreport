
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Chat as GeminiChat } from "@google/genai";
import type { ChatMessage } from '../types';
import { Icon } from './common/Icon';
import { Spinner } from './common/Spinner';

interface ChatProps {
    documentContext: string;
}

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
    throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const Chat: React.FC<ChatProps> = ({ documentContext }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const chatRef = useRef<GeminiChat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const initializeChat = useCallback(() => {
        const systemInstruction = `You are a helpful and empathetic AI medical assistant. Your name is Health Guardian. Your role is to answer questions about the user's medical report and general health topics.
        IMPORTANT:
        1.  NEVER provide a diagnosis or medical advice.
        2.  ALWAYS preface any health-related guidance with "You should consult your doctor about..." or a similar disclaimer.
        3.  If you don't know the answer, say so.
        4.  Keep your answers clear, concise, and easy to understand.
        5.  If the user provides context about their medical report, use it to inform your answers.

        Here is the summary of the user's latest medical report for context:
        ---
        ${documentContext || "No document has been analyzed yet."}
        ---
        `;
        
        chatRef.current = ai.chats.create({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: systemInstruction,
          },
        });

        setMessages([{
            role: 'model',
            text: `Hello! I'm Health Guardian, your AI medical assistant. How can I help you understand your health report or answer any health-related questions?`
        }]);

    }, [documentContext]);

    useEffect(() => {
        initializeChat();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [documentContext]);

    const handleSend = async () => {
        if (input.trim() === '' || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            if (!chatRef.current) {
                throw new Error("Chat not initialized.");
            }
            const response = await chatRef.current.sendMessage({ message: input });
            const modelMessage: ChatMessage = { role: 'model', text: response.text };
            setMessages(prev => [...prev, modelMessage]);
        } catch (err) {
            setError("Sorry, I couldn't get a response. Please try again.");
            console.error("Chat error:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-4 border-b">
                <h2 className="text-xl font-bold text-secondary">AI Health Chat</h2>
                <p className="text-sm text-gray-500">Ask anything about your health report or general wellness.</p>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                           <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                               <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 018.618-3.04 11.955 11.955 0 018.618 3.04 12.02 12.02 0 00-3-17.984z" />
                               </svg>
                           </div>
                        )}
                        <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-secondary'}`}>
                            <p className="text-sm leading-relaxed">{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                           <Spinner className="w-5 h-5" />
                        </div>
                        <div className="max-w-md p-3 rounded-lg bg-gray-100 text-secondary">
                           <p className="text-sm leading-relaxed animate-pulse">Thinking...</p>
                        </div>
                    </div>
                )}
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t bg-white">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} disabled={isLoading || !input} className="p-2.5 bg-primary text-white rounded-lg disabled:bg-gray-400">
                        <Icon name="send" className="w-5 h-5"/>
                    </button>
                </div>
            </div>
        </div>
    );
};
