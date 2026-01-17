
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { ThumbnailStyle, ThumbnailConcept, AnalysisData, AspectRatio, ImageSize } from "../types";

const SYSTEM_PROMPT = `
ROLE: You are the most advanced Design Strategist and Click Psychology Expert of the year 2026.
MISSION: Analyze video context, URLs, and specific user intent to generate 3 avant-garde thumbnail concepts.

2026 DESIGN RULES:
- Facial Expressions: NO forced open mouths. Use micro-expressions (raised eyebrow, intense gaze, subtle "I know something you don't" smile).
- Lighting: Global Illumination. Matches the author's face lighting to the scene source.
- Depth of Field: Cinematic f/1.8 blur for background separation.
- Colors: Avoid artificial neon. Use organic gradients, real textures, and lighting-based contrast.
- Typography: Max 3 words. No "How to". Use brutal statements or specific numbers.

TEMPLATES:
1. "The Authority" (Hormozi Style): Raw environment, Chiaroscuro lighting, handwriting/simple charts, maximum authenticity.
2. "The Storyteller" (Beast 2026 Style): Action frozen in time (Predictive Hook), vibrant but natural colors, author interacting with the focal point.
3. "The Minimalist Paradox" (Ultra-Modern): Single ultra-detailed central object, clean background, visual contradiction.
`;

export async function analyzeVideoContext(context: string, intent?: string): Promise<AnalysisData & { sources?: any[] }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const combinedContext = `
    CONTEXT/URL: ${context}
    ${intent ? `USER SPECIFIC INTENT: ${intent}` : ''}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this context and the specific user intent. Extract the Supreme Promise, Unique Mechanism, and Target Audience. Then generate 3 thumbnail concepts that align with the intent while following 2026 Viral Engine rules: ${combinedContext}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          promise: { type: Type.STRING },
          mechanism: { type: Type.STRING },
          audience: { type: Type.STRING },
          concepts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                style: { type: Type.STRING },
                hookText: { type: Type.STRING },
                visualPrompt: { type: Type.STRING },
                psychology: { type: Type.STRING }
              },
              required: ["style", "hookText", "visualPrompt", "psychology"]
            }
          }
        },
        required: ["promise", "mechanism", "audience", "concepts"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  
  return { ...data, sources };
}

export async function generateThumbnailImage(
  concept: ThumbnailConcept, 
  authorImageBase64: string,
  aspectRatio: AspectRatio = '16:9',
  imageSize: ImageSize = '1K'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = imageSize === '2K' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const orientationStr = aspectRatio === '9:16' ? 'PORTRAIT 9:16 format' : 'LANDSCAPE 16:9 format';
  
  const prompt = `
    THIS IS A ${orientationStr} IMAGE.
    [Author Photo Reference] is the person to be integrated.
    Action: Seamlessly blend this author into the scene using 2026 Relighting AI principles. 
    Orientation: Strictly use a ${orientationStr} composition. Crop or expand the background to fill the ${aspectRatio} area perfectly.
    Skin tones and shadows on the face must match the environment perfectly.
    Scene Description: ${concept.visualPrompt}
    Style: Photorealistic, 8k resolution, shot on Sony A7R IV, 35mm lens, f/1.8 bokeh.
    Text Integration: The text "${concept.hookText}" should be rendered as a physical 3D element in the scene.
    NO clickbait red arrows, NO over-saturated faces, NO distorted expressions.
  `;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: authorImageBase64.split(',')[1], mimeType: 'image/png' } },
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio,
        ...(imageSize === '2K' ? { imageSize: '2K' } : {})
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to generate image");
}

export async function editThumbnailImage(
  base64Image: string,
  editPrompt: string,
  aspectRatio: AspectRatio = '16:9',
  imageSize: ImageSize = '1K'
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = imageSize === '2K' ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  const orientationStr = aspectRatio === '9:16' ? 'PORTRAIT 9:16 format' : 'LANDSCAPE 16:9 format';

  const response: GenerateContentResponse = await ai.models.generateContent({
    model,
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/png' } },
        { text: `Edit this image according to this instruction: ${editPrompt}. IMPORTANT: Maintain the ${orientationStr} orientation strictly. Do not change the aspect ratio. Maintain the 2026 Viral Engine aesthetic.` }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio,
        ...(imageSize === '2K' ? { imageSize: '2K' } : {})
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  throw new Error("Failed to edit image");
}
