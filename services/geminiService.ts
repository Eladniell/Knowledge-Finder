
import { GoogleGenAI, Type } from "@google/genai";
import { Article, DashboardData } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    popularTopics: {
      type: Type.ARRAY,
      description: "The top 5 most popular topics based on content and view counts.",
      items: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING, description: "The name of the popular topic." },
          score: { type: Type.NUMBER, description: "A popularity score from 0 to 100." },
        },
        required: ["topic", "score"],
      },
    },
    emergingTrends: {
      type: Type.ARRAY,
      description: "A list of 3-5 emerging trends based on recently created articles.",
      items: {
        type: Type.STRING,
      },
    },
  },
  required: ["popularTopics", "emergingTrends"],
};

export const analyzeTopicsAndTrends = async (articles: Article[]): Promise<DashboardData> => {
  try {
    const articlesForAnalysis = articles.map(({ title, content, viewCount, createdAt }) => ({
      title,
      content,
      viewCount,
      createdAt,
    }));

    const prompt = `
      Analyze the following articles from our internal knowledge base. 
      Based on their content, view counts, and creation dates, identify:
      1. The top 5 most popular topics. A topic is popular if it has high view counts or is frequently mentioned.
      2. 3-5 emerging trends. An emerging trend is a topic that appears more frequently in recently created articles.

      Articles: ${JSON.stringify(articlesForAnalysis)}
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    // Validate data structure
    if (data.popularTopics && data.emergingTrends) {
      return data as DashboardData;
    } else {
      throw new Error("Invalid data structure received from Gemini API.");
    }

  } catch (error) {
    console.error("Error analyzing topics with Gemini:", error);
    throw new Error("Failed to get insights from AI. Please check your API key and try again.");
  }
};
