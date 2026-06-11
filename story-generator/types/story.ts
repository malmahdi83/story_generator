export type StoryTheme = "fantasy" | "scifi" | "horror" | "comedy";

export interface StoryFormData {
  childName: string;
  childAge: number;
  theme: StoryTheme;
  plot: string;
  apiKey: string;
  imageApiKey: string;
}
