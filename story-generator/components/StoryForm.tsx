"use client";

import { useState } from "react";
import type { StoryFormData, StoryTheme } from "@/types/story";

const THEMES: { value: StoryTheme; label: string; emoji: string; glow: string; bg: string }[] = [
  { value: "fantasy",  label: "Fantasy",  emoji: "🧙‍♂️", glow: "#a855f7", bg: "from-purple-900/60 to-indigo-900/60 border-purple-500/50" },
  { value: "scifi",    label: "Sci-Fi",   emoji: "🚀", glow: "#06b6d4", bg: "from-cyan-900/60 to-blue-900/60 border-cyan-500/50"    },
  { value: "horror",   label: "Spooky",   emoji: "👻", glow: "#22c55e", bg: "from-green-900/60 to-gray-900/60 border-green-500/50"  },
  { value: "comedy",   label: "Comedy",   emoji: "😂", glow: "#f59e0b", bg: "from-yellow-900/60 to-orange-900/60 border-yellow-500/50" },
];

interface Props {
  onGenerate: (data: StoryFormData) => void;
  loading: boolean;
}

function KeyInput({
  label, hint, value, onChange, placeholder,
}: {
  label: string; hint: string; value: string; onChange: (v: string) => void; placeholder: string;
}) {
  const [show, setShow] = useState(false);
  const inputClass =
    "w-full bg-indigo-950/50 border border-indigo-700/50 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-500 input-glow transition-all pr-12";
  return (
    <div>
      <label className="block text-indigo-300 text-sm font-semibold mb-2 tracking-wide uppercase">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
          required
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-200 transition-colors text-sm"
        >
          {show ? "🙈" : "👁️"}
        </button>
      </div>
      <p className="text-indigo-600 text-xs mt-1">
        {hint}{" "}
        <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer"
          className="underline text-indigo-400 hover:text-indigo-300">
          Get a free key →
        </a>
      </p>
    </div>
  );
}

export default function StoryForm({ onGenerate, loading }: Props) {
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(5);
  const [theme, setTheme] = useState<StoryTheme>("fantasy");
  const [plot, setPlot] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [imageApiKey, setImageApiKey] = useState("");

  const inputClass =
    "w-full bg-indigo-950/50 border border-indigo-700/50 rounded-xl px-4 py-3 text-indigo-100 placeholder-indigo-500 input-glow transition-all";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim() || !plot.trim() || !apiKey.trim() || !imageApiKey.trim()) return;
    onGenerate({
      childName: childName.trim(),
      childAge,
      theme,
      plot: plot.trim(),
      apiKey: apiKey.trim(),
      imageApiKey: imageApiKey.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Child Name */}
      <div>
        <label className="block text-indigo-300 text-sm font-semibold mb-2 tracking-wide uppercase">
          ✨ Child&apos;s Name
        </label>
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="e.g. Lily, Sam, Aiden…"
          className={inputClass}
          required
          maxLength={40}
        />
      </div>

      {/* Age */}
      <div>
        <label className="block text-indigo-300 text-sm font-semibold mb-2 tracking-wide uppercase">
          🎂 Age — {childAge} years old
        </label>
        <input
          type="range" min={2} max={12} value={childAge}
          onChange={(e) => setChildAge(Number(e.target.value))}
          className="w-full accent-indigo-400 cursor-pointer"
        />
        <div className="flex justify-between text-indigo-600 text-xs mt-1 px-1">
          <span>2</span><span>12</span>
        </div>
      </div>

      {/* Theme */}
      <div>
        <label className="block text-indigo-300 text-sm font-semibold mb-3 tracking-wide uppercase">
          🌙 Story Theme
        </label>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.value} type="button" onClick={() => setTheme(t.value)}
              className={`
                relative flex items-center gap-3 rounded-xl px-4 py-3 border bg-gradient-to-br transition-all duration-200 cursor-pointer
                ${t.bg}
                ${theme === t.value ? "ring-2 scale-[1.03]" : "opacity-70 hover:opacity-90"}
              `}
              style={theme === t.value ? { boxShadow: `0 0 16px 4px ${t.glow}66` } : {}}
            >
              <span className="text-2xl">{t.emoji}</span>
              <span className="text-white font-semibold text-sm">{t.label}</span>
              {theme === t.value && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-white" />}
            </button>
          ))}
        </div>
      </div>

      {/* Plot */}
      <div>
        <label className="block text-indigo-300 text-sm font-semibold mb-2 tracking-wide uppercase">
          📖 Your Plot Idea
        </label>
        <textarea
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          placeholder="Describe what happens in the story… e.g. 'The child discovers a hidden door in the garden that leads to a world of talking animals.'"
          rows={4}
          className={`${inputClass} resize-none`}
          required maxLength={600}
        />
        <p className="text-indigo-600 text-xs mt-1 text-right">{plot.length}/600</p>
      </div>

      {/* Story API Key */}
      <KeyInput
        label="🔑 OpenRouter API Key — Story"
        hint="Used to generate the story. Never stored."
        value={apiKey}
        onChange={setApiKey}
        placeholder="sk-or-…"
      />

      {/* Image API Key */}
      <KeyInput
        label="🎨 OpenRouter API Key — Illustration"
        hint="Used to generate the image prompt (google/gemma-4-31b-it:free). Never stored."
        value={imageApiKey}
        onChange={setImageApiKey}
        placeholder="sk-or-…"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || !childName.trim() || !plot.trim() || !apiKey.trim() || !imageApiKey.trim()}
        className="
          relative overflow-hidden mt-2 py-4 rounded-2xl font-bold text-lg tracking-wide
          bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
          hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-300 shadow-lg text-white
        "
        style={{ fontFamily: "var(--font-cinzel)" }}
      >
        {loading ? "Weaving your story…" : "✨ Generate Story"}
      </button>
    </form>
  );
}
