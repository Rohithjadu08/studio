
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
    let { articleText, sourceUrl } = data;

    if (!articleText && !sourceUrl) {
        throw new Error("Either article text or a URL must be provided.");
    }

    if (sourceUrl && !articleText) {
        articleText = await fetchArticleContentFromUrl(sourceUrl);
    }

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
}
