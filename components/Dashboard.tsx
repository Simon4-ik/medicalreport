
import React, { useState, useCallback } from 'react';
import type { MedicalAnalysis } from '../types';
import { FileUpload, type DocumentInput } from './FileUpload';
import { AnalysisDisplay } from './AnalysisDisplay';
import { analyzeMedicalDocument } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';
import { Card } from './common/Card';

interface DashboardProps {
  analysis: MedicalAnalysis | null;
  onAnalysisComplete: (analysis: MedicalAnalysis) => void;
}

const WelcomeScreen: React.FC = () => (
    <Card className="text-center">
        <div className="flex justify-center mb-4">
             <div className="bg-primary-light p-4 rounded-full">
                <Icon name="clipboard" className="w-10 h-10 text-primary" />
             </div>
        </div>
        <h2 className="text-2xl font-bold text-secondary mb-2">Welcome to Your Health Dashboard</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
            Upload or paste your medical reports to get a simple, clear, and actionable explanation. We'll help you understand complex terms, track your results, and prepare for your next doctor's visit.
        </p>
    </Card>
);

export const Dashboard: React.FC<DashboardProps> = ({ analysis, onAnalysisComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDocumentSubmit = useCallback(async (documentInput: DocumentInput) => {
    if (!documentInput.documentText?.trim() && !documentInput.documentImage) {
      setError("Please provide some text or an image from your medical document.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeMedicalDocument(documentInput);
      onAnalysisComplete(result);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [onAnalysisComplete]);
  
  return (
    <div className="space-y-6">
      {!analysis && !isLoading && <WelcomeScreen />}
      
      <FileUpload onDocumentSubmit={handleDocumentSubmit} isLoading={isLoading} />

      {isLoading && (
        <Card className="flex flex-col items-center justify-center p-10">
            <Spinner className="w-12 h-12" />
            <p className="mt-4 text-lg font-medium text-secondary">Analyzing your document...</p>
            <p className="text-gray-500">This may take a moment. The AI is working hard to simplify your report.</p>
        </Card>
      )}

      {error && (
        <Card className="border-accent-red bg-red-50 text-red-800">
            <div className="flex items-center">
                <Icon name="alert" className="w-6 h-6 mr-3"/>
                <div>
                    <h4 className="font-semibold">Analysis Failed</h4>
                    <p>{error}</p>
                </div>
            </div>
        </Card>
      )}

      {analysis && !isLoading && <AnalysisDisplay analysis={analysis} />}
    </div>
  );
};
