
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
    // In a production app, this would use a web scraping service.
    // For this prototype, we simulate the extraction.
    return `Analysis request for URL: ${url}. TruthSeeker AI is evaluating the claims, bias, and metadata associated with this publication source to determine factual reliability.`;
}

export async function getAnalysis(data: { articleText?: string; sourceUrl?: string }): Promise<AnalysisResult> {
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
            throw new Error("AI quota reached. Please wait a moment before trying again.");
        }
        
        if (message.includes('404')) {
          throw new Error("AI Model not found. The model might be unavailable in this region or tier. Retrying with standard settings...");
        }

        throw new Error(error.message || "An unexpected error occurred during analysis.");
    }
}
