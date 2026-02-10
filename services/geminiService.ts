
import { GoogleGenAI } from "@google/genai";

export async function generatePosterQuadrant(prompt: string): Promise<string | null> {
  try {
    // Re-initialize to ensure we use the latest selected API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    // Using imagen-4.0-generate-001 for robust image generation
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: `An artistic, cinematic visualization for a conceptual poster: ${prompt}. Minimalist, high contrast, powerful imagery.`,
      config: {
        numberOfImages: 1,
        aspectRatio: '1:1',
        outputMimeType: 'image/png'
      },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64EncodeString = response.generatedImages[0].image.imageBytes;
      return `data:image/png;base64,${base64EncodeString}`;
    }
    
    return null;
  } catch (error: any) {
    console.error("Error generating image:", error);
    // If we hit a missing entity error, it often means the key selection state needs a reset/re-auth
    if (error.message?.includes("Requested entity was not found")) {
      console.warn("API Key or Model mismatch. User may need to re-select key.");
    }
    return null;
  }
}
