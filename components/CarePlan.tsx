
import React, { useState, useCallback } from 'react';
import type { CarePlanData, KeyFinding } from '../types';
import { generateCarePlan } from '../services/geminiService';
import { Card } from './common/Card';
import { Spinner } from './common/Spinner';
import { Icon } from './common/Icon';

interface CarePlanProps {
  documentContext: string;
  keyFindings: KeyFinding[];
}

const CarePlanDisplay: React.FC<{ plan: CarePlanData }> = ({ plan }) => (
    <div className="space-y-6">
        <Card>
            <h2 className="text-2xl font-bold text-primary mb-2">{plan.planTitle}</h2>
            <p className="text-gray-600">{plan.introduction}</p>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plan.sections.map((section, index) => (
                <Card key={index} title={section.title} icon={<Icon name={section.icon} className="w-6 h-6"/>}>
                    <ul className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start">
                                <Icon name="check" className="w-5 h-5 text-accent-green mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-700">{item}</span>
                            </li>
                        ))}
                    </ul>
                </Card>
            ))}
        </div>
    </div>
);


export const CarePlan: React.FC<CarePlanProps> = ({ documentContext, keyFindings }) => {
  const [carePlan, setCarePlan] = useState<CarePlanData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateCarePlan(documentContext, keyFindings);
      setCarePlan(plan);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while generating the plan.');
    } finally {
      setIsLoading(false);
    }
  }, [documentContext, keyFindings]);

  const hasContext = documentContext && keyFindings.length > 0;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 p-4 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
            <h2 className="text-xl font-bold text-secondary">Personalized Care Plan</h2>
            <p className="text-sm text-gray-500">Generate a tailored plan based on your latest medical report.</p>
        </div>
        <button
          onClick={handleGeneratePlan}
          disabled={isLoading || !hasContext}
          className="w-full md:w-auto px-6 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
        >
          {isLoading ? <Spinner className="w-5 h-5"/> : <Icon name="lightbulb" className="w-5 h-5" />}
          {isLoading ? 'Generating Plan...' : 'Generate My Care Plan'}
        </button>
      </div>

      {!hasContext && (
        <Card className="text-center">
          <p className="text-gray-600">Please upload and analyze a medical document on the Dashboard first to generate a personalized care plan.</p>
        </Card>
      )}

      {isLoading && (
        <Card className="flex flex-col items-center justify-center p-10">
          <Spinner className="w-12 h-12" />
          <p className="mt-4 text-lg font-medium text-secondary">Creating your personalized plan...</p>
          <p className="text-gray-500">The AI is considering your results to provide helpful suggestions.</p>
        </Card>
      )}

      {error && (
        <Card className="border-accent-red bg-red-50 text-red-800">
            <div className="flex items-center">
                <Icon name="alert" className="w-6 h-6 mr-3"/>
                <div>
                    <h4 className="font-semibold">Generation Failed</h4>
                    <p>{error}</p>
                </div>
            </div>
        </Card>
      )}
      
      {carePlan && !isLoading && <CarePlanDisplay plan={carePlan} />}
    </div>
  );
};
