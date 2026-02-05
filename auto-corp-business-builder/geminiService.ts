
import { GoogleGenAI, Type } from "@google/genai";
import { SYSTEM_PROMPT } from "./constants";
import { VCRecommendation, EntityAdvice } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getVCMatch(businessIdea: string, industry: string): Promise<VCRecommendation[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Match the following business to 3 realistic VC firms or types. 
    Business: ${businessIdea} in ${industry} industry.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            focus: { type: Type.STRING },
            fitScore: { type: Type.NUMBER },
            reason: { type: Type.STRING }
          },
          required: ["name", "focus", "fitScore", "reason"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("VC Matching Error:", e);
    return [];
  }
}

export async function getEntityAdvice(jurisdiction: string, industry: string): Promise<EntityAdvice> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Identify the fastest minimum viable legal entity for ${industry} in ${jurisdiction}.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedEntity: { type: Type.STRING },
          keyRegulation: { type: Type.STRING },
          timeToSpinUp: { type: Type.STRING }
        },
        required: ["recommendedEntity", "keyRegulation", "timeToSpinUp"]
      }
    }
  });
  
  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Advice Error:", e);
    return { recommendedEntity: 'LLC', keyRegulation: 'Local Authority', timeToSpinUp: '24 Hours' };
  }
}

export async function getInfraAdvice(industry: string) {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Recommend the top 3 digital banking and operational tools for a new ${industry} company.`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            tool: { type: Type.STRING },
            category: { type: Type.STRING },
            benefit: { type: Type.STRING }
          }
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
}
