
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
  correctiveNewsLinks: z.array(z.string().url()),
});
export type ProvideCorrectiveNewsOutput = z.infer<typeof ProvideCorrectiveNewsOutputSchema>;

const provideCorrectiveNewsPrompt = ai.definePrompt({
  name: 'provideCorrectiveNewsPrompt',
  input: { schema: ProvideCorrectiveNewsInputSchema },
  prompt: `Given the following news content, provide 3-5 links to highly reputable, verified sources (like Reuters, AP News, or BBC) that cover this topic accurately.
  
  Content: {{{fakeNews}}}

  IMPORTANT: Return your response ONLY as a raw JSON object.
  Expected JSON structure:
  {
    "correctiveNewsLinks": ["https://url1.com", "https://url2.com"]
  }`,
});

export async function provideCorrectiveNews(input: ProvideCorrectiveNewsInput): Promise<ProvideCorrectiveNewsOutput> {
  const response = await provideCorrectiveNewsPrompt(input);
  const rawText = response.text;
  
  try {
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in AI response");
    return JSON.parse(jsonMatch[0]) as ProvideCorrectiveNewsOutput;
  } catch (e) {
    console.error("AI Links Parse Error:", rawText);
    throw new Error("Failed to find corrective news links. The AI response was not in the expected format.");
  }
}
