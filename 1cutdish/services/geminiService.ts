
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateChefTip = async (dishName: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `당신은 세계적인 요리사 '셰프 제미니'입니다. '${dishName}'에 대한 아주 짧고 강력한 요리 팁 하나를 한국어로 알려주세요. 만화적이고 친근한 말투로 1~2문장으로 답해주세요.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      },
    });
    return response.text || "맛있게 요리해보세요! 정성이 최고의 비법입니다.";
  } catch (error) {
    console.error("Error generating chef tip:", error);
    return "맛있게 요리하는 비결은 바로 당신의 열정입니다!";
  }
};
