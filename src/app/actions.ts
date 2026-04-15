
'use server';

import { analyzeNewsContent, type AnalyzeNewsContentOutput } from '@/ai/flows/analyze-news-content';
import { analyzeNewsSource, type AnalyzeNewsSourceOutput } from '@/ai/flows/analyze-news-source';
import { provideCorrectiveNews, type ProvideCorrectiveNewsOutput } from '@/ai/flows/provide-corrective-news';

export type AnalysisResult = {
    contentAnalysis: AnalyzeNewsContentOutput | null;
    sourceAnalysis: AnalyzeNewsSourceOutput | null;
    correctiveNews: ProvideCorrectiveNewsOutput | null;
};

async function fetchArticleContentFromUrl(url: string): Promise<string> {
    // In a real app, you would use a scraping service here.
    return `This is a simulated news article extracted from the URL: ${url}. The content discusses a recent geopolitical event or a local news story. TruthSeeker AI will now analyze this text for potential misinformation, bias, and factual accuracy.`;
}

export async function getAnalysis(data: { articleText?: string; sourceUrl?: string }): Promise<AnalysisResult> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. Please add it to your environment variables in Google AI Studio.");
    }
    
    let { articleText, sourceUrl } = data;

    if (!articleText && !sourceUrl) {
        throw new Error("Please provide either an article URL or paste the content text.");
    }

    if (sourceUrl && !articleText) {
        articleText = await fetchArticleContentFromUrl(sourceUrl);
    }

    try {
        const [contentAnalysis, sourceAnalysis] = await Promise.all([
            articleText ? analyzeNewsContent({ articleText }) : Promise.resolve(null),
            sourceUrl ? analyzeNewsSource({ sourceUrl }) : Promise.resolve(null),
        ]);
        
        let correctiveNews: ProvideCorrectiveNewsOutput | null = null;
        if (contentAnalysis && articleText && contentAnalysis.credibilityScore < 0.6) {
            correctiveNews = await provideCorrectiveNews({ fakeNews: articleText });
        }

        return {
            contentAnalysis,
            sourceAnalysis,
            correctiveNews,
        };
    } catch (error: any) {
        console.error("Analysis Action Error:", error);
        
        const message = error.message || "";
        
        if (message.includes('429')) {
            throw new Error("AI service quota reached. Please try again in a few moments.");
        }
        
        if (message.includes('404')) {
            throw new Error("The AI model was not found. Please ensure your API key has access to Gemini 1.5 Flash.");
        }

        if (message.includes('400')) {
          throw new Error("There was a problem communicating with the AI. This usually happens if the model is not yet available in your region or for your API version.");
        }
        
        throw new Error(error.message || "An unexpected error occurred during the analysis process.");
    }
}
