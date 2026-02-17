'use server';

/**
 * @fileOverview This file contains the Genkit flow for providing corrective news.
 *
 * It defines a flow that, given a piece of fake news, provides links to articles that present accurate and verified information.
 *
 * @file ProvideCorrectiveNewsFlow - A function that takes fake news as input and returns links to accurate news articles.
 * @file ProvideCorrectiveNewsInput - The input type for the ProvideCorrectiveNewsFlow function.
 * @file ProvideCorrectiveNewsOutput - The return type for the ProvideCorrectiveNewsFlow function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideCorrectiveNewsInputSchema = z.object({
  fakeNews: z.string().describe('The fake news article content.'),
});
export type ProvideCorrectiveNewsInput = z.infer<typeof ProvideCorrectiveNewsInputSchema>;

const ProvideCorrectiveNewsOutputSchema = z.object({
  correctiveNewsLinks: z
    .array(z.string().url())
    .describe('Links to articles that present accurate and verified information.'),
});
export type ProvideCorrectiveNewsOutput = z.infer<typeof ProvideCorrectiveNewsOutputSchema>;

export async function provideCorrectiveNews(input: ProvideCorrectiveNewsInput): Promise<ProvideCorrectiveNewsOutput> {
  return provideCorrectiveNewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideCorrectiveNewsPrompt',
  input: {schema: ProvideCorrectiveNewsInputSchema},
  prompt: `Given the following fake news article, provide links to articles that present accurate and verified information.

Fake News:
{{{fakeNews}}}

You MUST respond with a valid JSON object only, without any markdown formatting or other text. The JSON object should contain a single key "correctiveNewsLinks" which is an array of URL strings.`,
});

const provideCorrectiveNewsFlow = ai.defineFlow(
  {
    name: 'provideCorrectiveNewsFlow',
    inputSchema: ProvideCorrectiveNewsInputSchema,
    outputSchema: ProvideCorrectiveNewsOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    const rawText = response.text;
    try {
      const jsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonText);
      return ProvideCorrectiveNewsOutputSchema.parse(parsed);
    } catch (e) {
      console.error("Failed to parse JSON from model output:", { rawText, error: e });
      throw new Error("The AI returned data in an unexpected format.");
    }
  }
);
