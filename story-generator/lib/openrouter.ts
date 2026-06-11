import type { StoryFormData, StoryTheme } from "@/types/story";

const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

const themeInstructions: Record<StoryTheme, string> = {
  fantasy:
    "Write in a magical fantasy style — enchanted forests, friendly dragons, wizards, and wonder. Keep it whimsical and warm.",
  scifi:
    "Write in a fun sci-fi style — rockets, friendly robots, alien planets, and space adventures. Keep it imaginative and age-appropriate.",
  horror:
    "Write in a MILD, age-appropriate spooky style — gentle frights like haunted houses, friendly ghosts, and mysterious shadows. NO real horror; keep it fun-scary, never traumatizing.",
  comedy:
    "Write in a funny, silly style — lots of humor, jokes, funny characters, and lighthearted mishaps. Make it giggle-worthy.",
};

async function callOpenRouter(apiKey: string, model: string, messages: { role: string; content: string }[], maxTokens: number): Promise<string> {
  const response = await fetch(OPENROUTER_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "",
      "X-Title": "Bedtime Story Generator",
    },
    body: JSON.stringify({ model, messages, temperature: 0.85, max_tokens: maxTokens }),
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

  const systemPrompt = `You are a master bedtime storyteller for children.
${themeInstructions[theme]}
Always:
- Keep the story appropriate for a ${childAge}-year-old child.
- Make "${childName}" the hero/main character.
- Write 4–6 paragraphs.
- End with a peaceful, sleep-inducing conclusion.
- Use vivid, imaginative language.
- Do NOT include any adult content, violence, or inappropriate themes.`;

  const userPrompt = `Write a ${theme} bedtime story for ${childAge}-year-old ${childName}.
The story should be based on this plot idea: ${plot}

Return only the story text, no titles or meta-commentary.`;

  return callOpenRouter(
    apiKey,
    "google/gemma-4-31b-it:free",
    [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    1200
  );
}

export async function generateImagePrompt(story: string, theme: StoryTheme, apiKey: string): Promise<string> {
  const prompt = `Read this children's bedtime story and write a single short image generation prompt (max 30 words) that captures the most magical scene from it.
The image should be in a soft, dreamy, illustrated children's book style appropriate for a ${theme} story.
Return ONLY the image prompt — no explanation, no quotes, no extra text.

Story:
${story.slice(0, 800)}`;

  const result = await callOpenRouter(
    apiKey,
    "google/gemma-4-31b-it:free",
    [{ role: "user", content: prompt }],
    80
  );

  // Append style keywords for better image quality
  return `${result}, children's book illustration, soft watercolor, dreamy, magical, bedtime`;
}

export function buildImageUrl(imagePrompt: string): string {
  const encoded = encodeURIComponent(imagePrompt);
  return `https://image.pollinations.ai/prompt/${encoded}?width=800&height=450&nologo=true&seed=42`;
}
