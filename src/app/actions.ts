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
    console.log(`Fetching content from ${url} is not implemented in this version.`);
    // In a real app, this would use a library like Cheerio or Puppeteer to scrape the article text.
    // For this demonstration, we'll return a placeholder text to show the flow.
    return `This is placeholder text for an article from the URL: ${url}. The content analysis below is based on this placeholder. A real implementation would scrape the article's actual text content.`;
}

export async function getAnalysis(data: { articleText?: string; sourceUrl?: string }): Promise<AnalysisResult> {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("The GEMINI_API_KEY is not set. Please provide it in your project's environment variables to use the AI features.");
    }
    
    let { articleText, sourceUrl } = data;

    if (!articleText && !sourceUrl) {
        throw new Error("Either article text or a URL must be provided.");
    }

    if (sourceUrl && !articleText) {
        articleText = await fetchArticleContentFromUrl(sourceUrl);
    }

    try {
        const analysisPromises: [
            Promise<AnalyzeNewsContentOutput | null>,
            Promise<AnalyzeNewsSourceOutput | null>
        ] = [
            articleText ? analyzeNewsContent({ articleText }) : Promise.resolve(null),
            sourceUrl ? analyzeNewsSource({ sourceUrl }) : Promise.resolve(null),
        ];

        const [contentAnalysis, sourceAnalysis] = await Promise.all(analysisPromises);
        
        let correctiveNews: ProvideCorrectiveNewsOutput | null = null;
        
        if (contentAnalysis && articleText && contentAnalysis.credibilityScore < 0.5) {
            correctiveNews = await provideCorrectiveNews({ fakeNews: articleText });
        }

        return {
            contentAnalysis,
            sourceAnalysis,
            correctiveNews,
        };
    } catch (error: any) {
        // Handle specific AI errors
        if (error.message?.includes('429') || error.message?.includes('quota')) {
            throw new Error("AI Quota Exceeded. The free tier has limits on how many requests you can make per minute. Please wait a few seconds and try again.");
        }
        if (error.message?.includes('404')) {
            throw new Error("AI Model Not Found. This usually means the model identifier is incorrect or not available in your region. We've updated it to a stable version, please try again.");
        }
        
        throw error;
    }
}
