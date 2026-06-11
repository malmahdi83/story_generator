import type { StoryFormData, StoryTheme } from "@/types/story";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat-v3-0324:free";

const themeInstructions: Record<StoryTheme, string> = {
  fantasy: "Write in a magical fantasy style — enchanted forests, friendly dragons, wizards, and wonder.",
  scifi:   "Write in a fun sci-fi style — rockets, friendly robots, alien planets, and space adventures.",
  horror:  "Write in a MILD, age-appropriate spooky style — gentle frights like friendly ghosts and mysterious shadows. Fun-scary only, never traumatizing.",
  comedy:  "Write in a funny, silly style — lots of humor, jokes, funny characters, and lighthearted mishaps.",
};

async function callOpenRouter(
  apiKey: string,
  messages: { role: string; content: string }[],
  maxTokens: number
): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
      "X-Title": "Bedtime Story Generator",
    },
    body: JSON.stringify({ model: MODEL, messages, temperature: 0.85, max_tokens: maxTokens }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const msg = (errData as { error?: { message?: string } })?.error?.message;
    throw new Error(msg || `API error: ${response.status}`);
  }

  const json = await response.json();
  const content = json?.choices?.[0]?.message?.content as string | undefined;
  if (!content) throw new Error("Empty response from API. Please try again.");
  return content.trim();
}

export async function generateStory(data: StoryFormData): Promise<string> {
  const { childName, childAge, theme, plot, apiKey } = data;
  if (!apiKey.trim()) throw new Error("Please enter your OpenRouter API key.");

  const systemPrompt = `You are a concise bedtime storyteller for children.
${themeInstructions[theme]}
Rules:
- Write EXACTLY 3 short paragraphs (2 sentences each) — no more, no less.
- Keep every sentence simple and appropriate for a ${childAge}-year-old.
- Make "${childName}" the hero.
- End with a sleepy, peaceful sentence.
- Return only the story text with no title, no headings, no extra commentary.`;

  const userPrompt = `Write a short ${theme} bedtime story for ${childAge}-year-old ${childName} based on this plot: ${plot}`;

  return callOpenRouter(
    apiKey,
    [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    350
  );
}

export async function generateImagePrompt(
  story: string,
  theme: StoryTheme,
  apiKey: string
): Promise<string> {
  const prompt = `Read this short children's bedtime story and write ONE image generation prompt (max 20 words) describing the most magical scene.
Style: soft watercolor children's book illustration, dreamy, ${theme}, cozy bedtime.
Return ONLY the image prompt text — nothing else.

Story: ${story}`;

  const result = await callOpenRouter(
    apiKey,
    [{ role: "user", content: prompt }],
    60
  );

  return `${result.replace(/^["']|["']$/g, "")}, children's book watercolor illustration, soft dreamy lighting, bedtime, magical`;
}

export function buildImageUrl(imagePrompt: string): string {
  const encoded = encodeURIComponent(imagePrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=99`;
}
