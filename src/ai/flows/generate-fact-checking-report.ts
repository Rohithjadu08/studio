'use server';

/**
 * @fileOverview Generates a detailed fact-checking report for a news article.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateFactCheckingReportInputSchema = z.object({
  newsArticle: z.string().describe('The news article content to be analyzed.'),
});
export type GenerateFactCheckingReportInput = z.infer<typeof GenerateFactCheckingReportInputSchema>;

const GenerateFactCheckingReportOutputSchema = z.object({
  factCheckingReport: z.string(),
});
export type GenerateFactCheckingReportOutput = z.infer<typeof GenerateFactCheckingReportOutputSchema>;

const generateFactCheckingReportPrompt = ai.definePrompt({
  name: 'generateFactCheckingReportPrompt',
  input: {schema: GenerateFactCheckingReportInputSchema},
  prompt: `You are an expert fact-checker. Analyze the following news article and generate a detailed report highlighting any false or misleading information. 

News Article:
{{{newsArticle}}}

IMPORTANT: Return your report ONLY as a valid JSON object with the key:
- factCheckingReport (string)

Do not include any other text or markdown outside of the JSON.`,
});

export async function generateFactCheckingReport(input: GenerateFactCheckingReportInput): Promise<GenerateFactCheckingReportOutput> {
  const response = await generateFactCheckingReportPrompt(input);
  const rawText = response.text;
  
  try {
    const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson) as GenerateFactCheckingReportOutput;
  } catch (e) {
    console.error("Failed to parse AI response as JSON:", rawText);
    throw new Error("The AI provided an invalid report format.");
  }
}
