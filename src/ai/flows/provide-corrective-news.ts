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
  output: {schema: ProvideCorrectiveNewsOutputSchema},
  prompt: `Given the following fake news article, provide links to articles that present accurate and verified information. Return the links in the format specified in the output schema.\n\nFake News:\n{{{fakeNews}}}`,
});

const provideCorrectiveNewsFlow = ai.defineFlow(
  {
    name: 'provideCorrectiveNewsFlow',
    inputSchema: ProvideCorrectiveNewsInputSchema,
    outputSchema: ProvideCorrectiveNewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
