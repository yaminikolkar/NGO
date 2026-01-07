// api/gemini.ts
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { action, payload } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY!, // 🔒 SAFE (server-side only)
    });

    /* =======================
       1️⃣ QUICK SUMMARY
    ======================= */
    if (action === "quickSummary") {
      const response = await ai.models.generateContent({
        model: "gemini-flash-lite-latest",
        contents: `Provide a 2-sentence quick summary of: ${payload.topic}`,
      });

      return res.json({ text: response.text ?? "" });
    }

    /* =======================
       2️⃣ CHAT ASSISTANT
    ======================= */
    if (action === "chat") {
      const chat = ai.chats.create({
        model: "gemini-3-pro-preview",
        config: {
          systemInstruction:
            'You are a helpful NGO assistant for "NGO Nexus".',
        },
      });

      const response = await chat.sendMessage({
        message: payload.message,
      });

      return res.json({ text: response.text ?? "" });
    }

    /* =======================
       3️⃣ SEARCH GROUNDING
    ======================= */
    if (action === "search") {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: payload.query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const sources =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks
          ?.map((c: any) => c.web)
          .filter(Boolean) || [];

      return res.json({ text: response.text ?? "", sources });
    }

    /* =======================
       4️⃣ MAPS GROUNDING
    ======================= */
    if (action === "nearbyCharities") {
      const { lat, lng } = payload;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `List 5 highly-rated charity organizations near ${lat}, ${lng}.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: { latitude: lat, longitude: lng },
            },
          },
        },
      });

      const places =
        response.candidates?.[0]?.groundingMetadata?.groundingChunks
          ?.filter((c: any) => c.maps)
          ?.map((c: any) => ({
            title: c.maps.title,
            uri: c.maps.uri,
          })) || [];

      return res.json({ text: response.text ?? "", places });
    }

    /* =======================
       5️⃣ IMAGE GENERATION
    ======================= */
    if (action === "generatePoster") {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-image-preview",
        contents: {
          parts: [
            {
              text: `A professional NGO campaign poster: ${payload.prompt}`,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4",
            imageSize: payload.size,
          },
        },
      });

      const candidate = response.candidates?.[0];

      if (!candidate?.content?.parts) {
        return res.json({ image: null });
      }

      for (const part of candidate.content.parts as any[]) {
        if (part.inlineData?.data) {
          return res.json({
            image: `data:image/png;base64,${part.inlineData.data}`,
          });
        }
      }

      return res.json({ image: null });
    }

    /* =======================
       6️⃣ IMAGE EDITING
    ======================= */
    if (action === "editImage") {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            {
              inlineData: {
                data: payload.base64.split(",")[1],
                mimeType: "image/jpeg",
              },
            },
            { text: payload.instruction },
          ],
        },
      });

      const candidate = response.candidates?.[0];

      if (!candidate?.content?.parts) {
        return res.json({ image: null });
      }

      for (const part of candidate.content.parts as any[]) {
        if (part.inlineData?.data) {
          return res.json({
            image: `data:image/png;base64,${part.inlineData.data}`,
          });
        }
      }

      return res.json({ image: null });
    }

    /* =======================
       7️⃣ IMAGE ANALYSIS
    ======================= */
    if (action === "analyzeImage") {
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: {
          parts: [
            {
              inlineData: {
                data: payload.base64.split(",")[1],
                mimeType: "image/jpeg",
              },
            },
            {
              text:
                "Analyze this field photo and report visible needs or project status.",
            },
          ],
        },
      });

      return res.json({ text: response.text ?? "" });
    }

    return res.status(400).json({ error: "Invalid action" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gemini request failed" });
  }
}
