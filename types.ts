
export type RiskLevel = 'High' | 'Medium' | 'Low' | 'Normal' | 'Info';

export interface KeyFinding {
  term: string;
  explanation: string;
  value?: string;
  normalRange?: string;
  riskLevel: RiskLevel;
}

export interface MedicalAnalysis {
  summary: string;
  keyFindings: KeyFinding[];
  recommendations: string[];
  alerts: string[];
}

export interface CarePlanSection {
  title: string;
  items: string[];
  icon: string;
}

export interface CarePlanData {
  planTitle: string;
  introduction: string;
  sections: CarePlanSection[];
}


export type View = 'dashboard' | 'chat' | 'care-plan';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
