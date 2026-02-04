import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-news-source.ts';
import '@/ai/flows/provide-corrective-news.ts';
import '@/ai/flows/generate-fact-checking-report.ts';
import '@/ai/flows/analyze-news-content.ts';