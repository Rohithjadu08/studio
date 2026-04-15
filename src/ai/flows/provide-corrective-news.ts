
'use server';

/**
 * @fileOverview Provides corrective news links.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ProvideCorrectiveNewsInputSchema = z.object({
  fakeNews: z.string().describe('The fake news article content.'),
});
export type ProvideCorrectiveNewsInput = z.infer<typeof ProvideCorrectiveNewsInputSchema>;

const ProvideCorrectiveNewsOutputSchema = z.object({
  correctiveNewsLinks: z.array(z.string().url()).describe('List of URLs to reputable sources covering the topic accurately.'),
});
export type ProvideCorrectiveNewsOutput = z.infer<typeof ProvideCorrectiveNewsOutputSchema>;

const provideCorrectiveNewsPrompt = ai.definePrompt({
  name: 'provideCorrectiveNewsPrompt',
  input: { schema: ProvideCorrectiveNewsInputSchema },
  output: { schema: ProvideCorrectiveNewsOutputSchema },
  prompt: `Given the following news content, provide 3-5 links to highly reputable, verified sources (like Reuters, AP News, or BBC) that cover this topic accurately.
  
  Content: {{{fakeNews}}}`,
});

export async function provideCorrectiveNews(input: ProvideCorrectiveNewsInput): Promise<ProvideCorrectiveNewsOutput> {
  const { output } = await provideCorrectiveNewsPrompt(input);
  if (!output) {
    throw new Error("AI failed to provide corrective news links.");
  }
  return output;
}
