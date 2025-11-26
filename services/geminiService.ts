import { GoogleGenAI } from "@google/genai";
import { BackgroundColor, Gender, OutfitOption } from "../types";
import { BACKGROUND_PROMPTS, GLOBAL_NEGATIVE_PROMPT } from "../constants";

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return apiKey;
};

export const generateProfessionalHeadshot = async (
  imageBase64: string,
  mimeType: string,
  gender: Gender,
  outfit: OutfitOption,
  background: BackgroundColor,
  customInstruction: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getApiKey() });
    
    // Construct a detailed prompt for the edit
    const outfitPrompt = outfit.promptFragment;
    const bgPrompt = BACKGROUND_PROMPTS[background];
    
    // We construct a specific instruction for the model
    // Gemini 2.5 Flash Image is excellent at following instructions to modify images.
    const promptText = `
      Act as a professional photo editor.
      Edit this image to create a high-quality professional headshot suitable for a passport, ID card, or official profile.
      
      Instructions:
      1. Keep the person's face and identity exactly the same. Do not change facial features.
      2. Change the person's outfit: ${outfitPrompt}. Ensure the fit looks natural and tailored.
      3. Change the background to: ${bgPrompt}.
      4. Ensure the lighting is professional studio lighting (soft, even, flattering).
      5. Aspect ratio should be strictly maintained or cropped to a 3:4 portrait ratio if possible within the square frame.
      
      CRITICAL NEGATIVE CONSTRAINTS (Avoid these):
      ${GLOBAL_NEGATIVE_PROMPT}
      
      ${customInstruction ? `Additional Request: ${customInstruction}` : ''}
      
      Output a high-quality, photorealistic image.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana model for fast, high-quality image editing
      contents: {
        parts: [
          {
            inlineData: {
              data: imageBase64,
              mimeType: mimeType,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Passport/Professional format
        },
      },
    });

    // Parse response to find the image part
    if (response.candidates && response.candidates.length > 0) {
      const parts = response.candidates[0].content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
    }

    throw new Error("No image generated in the response.");

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
