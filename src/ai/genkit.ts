
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    // Using the stable v1 API version ensures maximum compatibility across regions
    googleAI({ apiVersion: 'v1' }),
  ],
  // flash-1.5 is the most reliable model for general tasks in this environment
  model: 'googleai/gemini-1.5-flash',
});
