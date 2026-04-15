
'use server';

/**
 * @fileOverview This file contains the Genkit flow for providing corrective news.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProvideCorrectiveNewsInputSchema = z.object({
  fakeNews: z.string().describe('The fake news article content.'),
});
export type ProvideCorrectiveNewsInput = z.infer<typeof ProvideCorrectiveNewsInputSchema>;

const ProvideCorrectiveNewsOutputSchema = z.object({
  correctiveNewsLinks: z.array(z.string().url()),
});
export type ProvideCorrectiveNewsOutput = z.infer<typeof ProvideCorrectiveNewsOutputSchema>;

const provideCorrectiveNewsPrompt = ai.definePrompt({
  name: 'provideCorrectiveNewsPrompt',
  input: { schema: ProvideCorrectiveNewsInputSchema },
  prompt: `Given the following news content, provide 3-5 links to highly reputable, verified sources (like Reuters, AP News, or BBC) that cover this topic accurately.
  
  Content: {{{fakeNews}}}

  IMPORTANT: Return your response ONLY as a raw JSON object with these fields:
  {
    "correctiveNewsLinks": string[]
  }

  Do not include markdown blocks or any other text.`,
});

export async function provideCorrectiveNews(input: ProvideCorrectiveNewsInput): Promise<ProvideCorrectiveNewsOutput> {
  const response = await provideCorrectiveNewsPrompt(input);
  const rawText = response.text;
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Could not find JSON in response");
    return JSON.parse(jsonMatch[0]) as ProvideCorrectiveNewsOutput;
  } catch (e) {
    console.error("AI returned invalid JSON for news links:", rawText);
    throw new Error("The AI failed to find corrective news. Please try again.");
  }
}
