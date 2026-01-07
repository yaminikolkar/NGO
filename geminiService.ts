async function callGemini(action: string, payload: any) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });

  if (!res.ok) throw new Error("Gemini API failed");
  return res.json();
}

export const getQuickSummary = (topic: string) =>
  callGemini("quickSummary", { topic });

export const chatWithNGOAssistant = (message: string) =>
  callGemini("chat", { message });

export const searchCharityTrends = (query: string) =>
  callGemini("search", { query });

export const findNearbyCharities = (lat: number, lng: number) =>
  callGemini("nearbyCharities", { lat, lng });

export const generateCampaignPoster = (prompt: string, size: string) =>
  callGemini("generatePoster", { prompt, size });

export const editImpactPhoto = (base64: string, instruction: string) =>
  callGemini("editImage", { base64, instruction });

export const analyzeFieldPhoto = (base64: string) =>
  callGemini("analyzeImage", { base64 });
