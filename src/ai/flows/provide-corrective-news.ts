'use server';

/**
 * @fileOverview This file contains the Genkit flow for providing corrective news.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  input: {schema: ProvideCorrectiveNewsInputSchema},
  prompt: `Given the following news content, provide 3-5 links to highly reputable, verified sources (like Reuters, AP News, or BBC) that cover this topic accurately.
  
  Content: {{{fakeNews}}}
  
  IMPORTANT: Return your response ONLY as a valid JSON object with the key:
  - correctiveNewsLinks (array of URL strings)
  
  Do not include any other text or markdown outside of the JSON.`,
});

export async function provideCorrectiveNews(input: ProvideCorrectiveNewsInput): Promise<ProvideCorrectiveNewsOutput> {
  const response = await provideCorrectiveNewsPrompt(input);
  const rawText = response.text;
  
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as ProvideCorrectiveNewsOutput;
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", rawText);
    throw new Error("The AI provided an invalid corrective news format.");
  }
}
