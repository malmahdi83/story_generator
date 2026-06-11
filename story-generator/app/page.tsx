"use client";

import { useState, useCallback } from "react";
import StarsBackground from "@/components/StarsBackground";
import StoryForm from "@/components/StoryForm";
import StoryOutput from "@/components/StoryOutput";
import { generateStory, generateImagePrompt, buildImageUrl } from "@/lib/openrouter";
import type { StoryFormData } from "@/types/story";

export default function Home() {
  const [story, setStory] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = useCallback(async (data: StoryFormData) => {
    setLoading(true);
    setError("");
    setStory("");
    setImageUrl("");
    try {
      const result = await generateStory(data);
      setStory(result);

      // Generate illustration after story is shown
      setLoadingImage(true);
      try {
        const imgPrompt = await generateImagePrompt(result, data.theme, data.apiKey);
        setImageUrl(buildImageUrl(imgPrompt));
      } catch {
        // Image generation is non-critical
      } finally {
        setLoadingImage(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-12">
      <StarsBackground />

      {/* Header */}
      <div className="relative z-10 text-center mb-10 select-none">
        <div className="floating inline-block mb-4">
          <div className="moon-glow w-20 h-20 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-400 mx-auto flex items-center justify-center text-4xl">
            🌙
          </div>
        </div>
        <h1
          className="text-4xl md:text-5xl font-bold text-yellow-200 tracking-wide"
          style={{ fontFamily: "var(--font-cinzel)" }}
        >
          Bedtime Story Magic
        </h1>
        <p
          className="mt-3 text-indigo-300 text-lg italic"
          style={{ fontFamily: "var(--font-lora)" }}
        >
          Craft a one-of-a-kind story for your little one ✨
        </p>
      </div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-2xl glass-card rounded-3xl p-8 shadow-2xl">
        <StoryForm onGenerate={handleGenerate} loading={loading} />
      </div>

      {/* Loading */}
      {loading && (
        <div className="relative z-10 mt-10 flex flex-col items-center gap-4">
          <div className="flex gap-3">
            <span className="dot-1 w-3 h-3 rounded-full bg-yellow-300 inline-block" />
            <span className="dot-2 w-3 h-3 rounded-full bg-indigo-400 inline-block" />
            <span className="dot-3 w-3 h-3 rounded-full bg-yellow-300 inline-block" />
          </div>
          <p className="text-indigo-300 italic text-sm" style={{ fontFamily: "var(--font-lora)" }}>
            The stars are weaving your story…
          </p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="relative z-10 mt-8 w-full max-w-2xl glass-card rounded-2xl p-5 border border-red-500/40 text-red-300 text-sm">
          ⚠️ {error}
        </div>
      )}

      {/* Story Output */}
      {story && !loading && (
        <div className="relative z-10 mt-10 w-full max-w-2xl">
          <StoryOutput story={story} imageUrl={imageUrl} loadingImage={loadingImage} />
        </div>
      )}

      {/* Footer */}
      <p className="relative z-10 mt-12 text-indigo-600 text-xs">
        Made with 🌙 for bedtime dreamers everywhere
      </p>
    </main>
  );
}
