import React, { useState, useRef } from "react";
import { User, UserRole } from "../types";
import {
  generateCampaignPoster,
  editImpactPhoto,
  analyzeFieldPhoto,
  searchCharityTrends,
} from "../geminiService";

const AITools: React.FC<{ user: User | null }> = ({ user }) => {
  const [activeTool, setActiveTool] =
    useState<"generate" | "edit" | "analyze" | "search">("generate");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState<"1K" | "2K" | "4K">("1K");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [searchResponse, setSearchResponse] = useState<{
    text?: string;
    sources?: any[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ======================
     ACCESS CONTROL
  ====================== */
  if (user?.role !== UserRole.ADMIN) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-2xl font-bold">Access Restricted</h2>
        <p className="text-slate-500">
          Only NGO Admins can access the AI Studio.
        </p>
      </div>
    );
  }

  /* ======================
     HELPERS
  ====================== */
  const toBase64 = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });

  /* ======================
     HANDLERS
  ====================== */
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const img = await generateCampaignPoster(prompt, size);
      setResult(img);
    } catch {
      alert("Poster generation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditOrAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setResult(null);

    try {
      const base64 = await toBase64(file);

      if (activeTool === "edit") {
        const img = await editImpactPhoto(
          base64,
          prompt || "Make this look more professional"
        );
        setResult(img);
      } else {
        const report = await analyzeFieldPhoto(base64);
        setResult(report);
      }
    } catch {
      alert("Image operation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setSearchResponse(null);

    try {
      const res = await searchCharityTrends(prompt);
      setSearchResponse(res);
    } catch {
      alert("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">NGO AI Studio</h1>
      <p className="text-slate-500 mb-8">
        Use Gemini-powered tools to enhance impact and storytelling.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-2">
          {(["generate", "edit", "analyze", "search"] as const).map((tool) => (
            <button
              key={tool}
              onClick={() => {
                setActiveTool(tool);
                setResult(null);
                setSearchResponse(null);
              }}
              className={`w-full px-4 py-3 rounded-xl text-left ${
                activeTool === tool
                  ? "bg-indigo-600 text-white"
                  : "hover:bg-slate-100 text-slate-600"
              }`}
            >
              <div className="font-bold capitalize">{tool}</div>
            </button>
          ))}
        </div>

        {/* Workspace */}
        <div className="lg:col-span-3 bg-white border rounded-2xl p-8">
          {(activeTool === "edit" || activeTool === "analyze") && (
            <div className="mb-6">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) =>
                  e.target.files && setFile(e.target.files[0])
                }
              />
            </div>
          )}

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter prompt..."
            className="w-full p-4 border rounded-xl mb-6"
          />

          {activeTool === "generate" && (
            <div className="flex gap-4 mb-6">
              {(["1K", "2K", "4K"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`px-4 py-2 rounded ${
                    size === s ? "bg-indigo-600 text-white" : "border"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <button
            disabled={loading || (activeTool !== "search" && activeTool !== "generate" && !file)}
            onClick={
              activeTool === "generate"
                ? handleGenerate
                : activeTool === "search"
                ? handleSearch
                : handleEditOrAnalyze
            }
            className="w-full py-3 bg-indigo-600 text-white rounded-xl"
          >
            {loading ? "Processing..." : "Run"}
          </button>

          {/* Results */}
          {(result || searchResponse) && (
            <div className="mt-8">
              {searchResponse ? (
                <pre>{searchResponse.text}</pre>
              ) : result?.startsWith("data:image") ? (
                <img src={result} alt="Result" className="rounded-xl" />
              ) : (
                <pre>{result}</pre>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITools;
