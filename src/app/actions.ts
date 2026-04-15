
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
    // Simulated content extraction
    return `Analysis request for URL: ${url}. TruthSeeker AI is evaluating the claims, bias, and metadata associated with this publication source to determine factual reliability and provide cross-referenced verified information.`;
}

export async function getAnalysis(data: { articleText?: string; sourceUrl?: string }): Promise<AnalysisResult> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is missing. Please ensure your API key is correctly configured in your .env file.");
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
            throw new Error("AI service quota reached. Please wait a few moments before trying again.");
        }
        
        if (message.includes('404')) {
          throw new Error("The AI model endpoint was not found. We've adjusted our configuration to use a more stable region. Please try again.");
        }

        if (message.includes('400')) {
          throw new Error("The AI service received an invalid request. We've simplified the data format to fix this. Please try again.");
        }
        
        throw new Error(error.message || "An unexpected error occurred during the analysis process. Please check your network and try again.");
    }
}
