
import React from 'react';
import type { MedicalAnalysis, KeyFinding } from '../types';
import { Card } from './common/Card';
import { RiskBadge } from './common/RiskBadge';
import { Icon } from './common/Icon';

interface AnalysisDisplayProps {
  analysis: MedicalAnalysis;
}

const KeyFindingCard: React.FC<{ finding: KeyFinding }> = ({ finding }) => (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex justify-between items-start mb-2">
            <h4 className="font-semibold text-secondary flex-1 pr-2">{finding.term}</h4>
            <RiskBadge level={finding.riskLevel} />
        </div>
        {finding.value && finding.normalRange && (
            <div className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Result: {finding.value}</span>
                <span className="ml-4">Normal Range: {finding.normalRange}</span>
            </div>
        )}
        <p className="text-sm text-gray-700">{finding.explanation}</p>
    </div>
);

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card title="Simplified Summary" icon={<Icon name="clipboard" className="w-6 h-6" />}>
          <p className="text-gray-600 leading-relaxed">{analysis.summary}</p>
        </Card>
        <Card title="Key Findings" icon={<Icon name="clipboard" className="w-6 h-6" />}>
            <div className="space-y-4">
                {analysis.keyFindings.map((finding, index) => (
                    <KeyFindingCard key={index} finding={finding} />
                ))}
            </div>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card title="Actionable Recommendations" icon={<Icon name="lightbulb" className="w-6 h-6" />} className="bg-primary-light border-primary">
            <ul className="space-y-3">
                {analysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                        <Icon name="check" className="w-5 h-5 text-accent-green mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-primary-dark">{rec}</span>
                    </li>
                ))}
            </ul>
        </Card>
        {analysis.alerts && analysis.alerts.length > 0 && (
            <Card title="When to See a Doctor" icon={<Icon name="alert" className="w-6 h-6"/>} className="bg-red-50 border-accent-red">
                 <ul className="space-y-3">
                    {analysis.alerts.map((alert, index) => (
                        <li key={index} className="flex items-start">
                            <Icon name="alert" className="w-5 h-5 text-accent-red mr-3 mt-0.5 flex-shrink-0" />
                            <span className="text-red-800 font-medium">{alert}</span>
                        </li>
                    ))}
                </ul>
            </Card>
        )}
      </div>
    </div>
  );
};
