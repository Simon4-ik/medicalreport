
import { GoogleGenAI, Type } from "@google/genai";
import type { MedicalAnalysis, CarePlanData } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.STRING,
      description: "A simple, one-paragraph summary of the medical document for a layperson.",
    },
    keyFindings: {
      type: Type.ARRAY,
      description: "An array of key findings from the report.",
      items: {
        type: Type.OBJECT,
        properties: {
          term: { type: Type.STRING, description: "The medical term or test name." },
          value: { type: Type.STRING, description: "The measured value from the report." },
          normalRange: { type: Type.STRING, description: "The normal range for this value." },
          explanation: { type: Type.STRING, description: "A simple explanation of what this term means." },
          riskLevel: {
            type: Type.STRING,
            enum: ['High', 'Medium', 'Low', 'Normal', 'Info'],
            description: "A color-coded risk level. Use 'High' or 'Medium' for results outside normal range, 'Normal' for results within range, and 'Info' for non-numeric findings."
          },
        },
        required: ["term", "explanation", "riskLevel"],
      },
    },
    recommendations: {
      type: Type.ARRAY,
      description: "A list of actionable next steps for the patient. Frame these as suggestions to discuss with a doctor, not as direct medical advice.",
      items: { type: Type.STRING }
    },
    alerts: {
      type: Type.ARRAY,
      description: "A list of 'When to see a doctor' alerts based on critical findings.",
      items: { type: Type.STRING }
    },
  },
  required: ["summary", "keyFindings", "recommendations", "alerts"],
};

interface DocumentAnalysisInput {
    documentText?: string;
    documentImage?: {
        base64: string; // The full data URL
        mimeType: string;
    };
}

export const analyzeMedicalDocument = async ({ documentText, documentImage }: DocumentAnalysisInput): Promise<MedicalAnalysis> => {
  const model = "gemini-2.5-pro";
  try {
    const prompt = `Analyze the following medical document. Interpret the results, explain complex terms in simple language, and provide structured, actionable guidance. IMPORTANT: Do not provide medical advice. All recommendations should be suggestions to discuss with a healthcare professional.\n\nDOCUMENT:`;

    let requestContents: any;

    if (documentText) {
        requestContents = `${prompt}\n${documentText}`;
    } else if (documentImage) {
        // The Gemini API expects a base64 string without the data URL prefix
        const base64Data = documentImage.base64.split(',')[1];
        requestContents = {
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        mimeType: documentImage.mimeType,
                        data: base64Data,
                    },
                },
            ],
        };
    } else {
        throw new Error("No document content provided.");
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: requestContents,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as MedicalAnalysis;
  } catch (error) {
    console.error("Error analyzing document with Gemini:", error);
    throw new Error("Failed to analyze the medical document. The AI model may be overloaded or the document format is unsupported.");
  }
};


const carePlanSchema = {
    type: Type.OBJECT,
    properties: {
        planTitle: { type: Type.STRING, description: "A concise title for the care plan, e.g., 'Heart Health Management Plan'." },
        introduction: { type: Type.STRING, description: "A brief, encouraging introductory paragraph for the patient." },
        sections: {
            type: Type.ARRAY,
            description: "An array of care plan sections.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "Title of the section, e.g., 'Dietary Adjustments', 'Medication Schedule'." },
                    items: {
                        type: Type.ARRAY,
                        description: "List of actionable items for this section.",
                        items: { type: Type.STRING }
                    },
                    icon: {
                        type: Type.STRING,
                        enum: ['diet', 'medication', 'activity', 'monitoring', 'appointment', 'general'],
                        description: "An icon name representing the section."
                    }
                },
                required: ["title", "items", "icon"]
            }
        }
    },
    required: ["planTitle", "introduction", "sections"]
};

export const generateCarePlan = async (documentContext: string, keyFindings: any[]): Promise<CarePlanData> => {
    const model = "gemini-2.5-pro";
    const findingsText = keyFindings.map(f => `${f.term}: ${f.value} (${f.riskLevel} risk)`).join('\n');
    
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: `Based on the following medical summary and key findings, generate a personalized, actionable care plan. Focus on evidence-based lifestyle adjustments, reminders, and questions to ask a doctor. Do not give direct medical advice. The tone should be supportive and clear.

            MEDICAL SUMMARY:
            ${documentContext}

            KEY FINDINGS:
            ${findingsText}
            `,
            config: {
                responseMimeType: "application/json",
                responseSchema: carePlanSchema
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CarePlanData;
    } catch (error) {
        console.error("Error generating care plan with Gemini:", error);
        throw new Error("Failed to generate the care plan. The AI model may be unavailable.");
    }
};
