"use client";

import { useRef, useState } from "react";

interface Props {
  story: string;
  imageUrl: string;
}

export default function StoryOutput({ story, imageUrl }: Props) {
  const storyRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(story);
  };

  const handlePrint = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    const imgTag =
      imageUrl && !imgError
        ? `<img src="${imageUrl}" alt="Story illustration" style="width:100%;border-radius:12px;margin-bottom:32px;" />`
        : "";
    win.document.write(`
      <html><head><title>Bedtime Story</title>
      <style>
        body { font-family: Georgia, serif; max-width: 680px; margin: 60px auto; line-height: 1.9; font-size: 18px; color: #1a1a2e; }
        h2 { text-align: center; font-size: 22px; margin-bottom: 24px; color: #3730a3; }
        p { margin-bottom: 1.5em; text-indent: 2em; }
      </style></head><body>
      <h2>🌙 Your Bedtime Story</h2>
      ${imgTag}
      ${story.split("\n\n").map((p) => `<p>${p}</p>`).join("")}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const paragraphs = story.split(/\n\n+/).filter(Boolean);

  return (
    <div className="story-fade-in glass-card rounded-3xl p-8 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-yellow-200" style={{ fontFamily: "var(--font-cinzel)" }}>
          🌙 Your Story
        </h2>
        <div className="flex gap-2">
          <button onClick={handleCopy}
            className="px-3 py-2 rounded-xl bg-indigo-800/60 hover:bg-indigo-700/80 text-indigo-200 text-sm transition-colors">
            📋 Copy
          </button>
          <button onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-indigo-800/60 hover:bg-indigo-700/80 text-indigo-200 text-sm transition-colors">
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mb-6" />

      {/* Story Text */}
      <div ref={storyRef} className="text-indigo-100 leading-8 text-[1.05rem] space-y-5"
        style={{ fontFamily: "var(--font-lora)" }}>
        {paragraphs.map((para, i) => (
          <p key={i} className="first-letter:text-3xl first-letter:font-bold first-letter:text-yellow-300 first-letter:float-left first-letter:mr-2 first-letter:leading-none">
            {para}
          </p>
        ))}
      </div>

      {/* Illustration */}
      <div className="mt-10">
        <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent mb-6" />
        <p className="text-center text-indigo-400 text-sm mb-4 italic" style={{ fontFamily: "var(--font-lora)" }}>
          🎨 Story Illustration
        </p>

        {imageUrl && !imgError && (
          <div className="relative w-full rounded-2xl overflow-hidden border border-indigo-700/40 shadow-xl">
            {/* Shimmer while loading */}
            {!imgLoaded && (
              <div className="w-full h-56 bg-indigo-900/50 animate-pulse rounded-2xl flex items-center justify-center">
                <p className="text-indigo-500 text-xs italic">Painting your illustration…</p>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt="Story illustration"
              className={`w-full h-auto object-cover rounded-2xl transition-opacity duration-700 ${imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </div>
        )}

        {imgError && (
          <p className="text-center text-indigo-600 text-xs italic py-4">
            Illustration could not be loaded. Try generating again.
          </p>
        )}
      </div>

      <div className="mt-8 text-center text-indigo-500 text-sm italic">
        — Sweet dreams ✨ —
      </div>
    </div>
  );
}
