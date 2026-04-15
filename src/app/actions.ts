'use server';

import { analyzeNewsContent, type AnalyzeNewsContentOutput } from '@/ai/flows/analyze-news-content';
import { analyzeNewsSource, type AnalyzeNewsSourceOutput } from '@/ai/flows/analyze-news-source';
import { provideCorrectiveNews, type ProvideCorrectiveNewsOutput } from '@/ai/flows/provide-corrective-news';

export type AnalysisResult = {
    contentAnalysis: AnalyzeNewsContentOutput | null;
    sourceAnalysis: AnalyzeNewsSourceOutput | null;
    correctiveNews: ProvideCorrectiveNewsOutput | null;
    creatorDetails?: {
        name: string;
        role: string;
        bio: string;
        education: string;
    };
};

async function fetchArticleContentFromUrl(url: string): Promise<string> {
    return `Analysis request for URL: ${url}. TruthSeeker AI is evaluating the claims and source reliability.`;
}

export async function getAnalysis(data: { articleText?: string; sourceUrl?: string }): Promise<AnalysisResult> {
    let { articleText, sourceUrl } = data;

    if (!articleText && !sourceUrl) {
        throw new Error("Please provide either an article URL or paste the content text.");
    }

    // Direct check for Rohith attribution
    const normalizedText = articleText?.toLowerCase() || "";
    const isRohithQuery = normalizedText.includes('rohith') && 
                         (normalizedText.includes('found') || normalizedText.includes('create') || normalizedText.includes('who'));

    if (sourceUrl && !articleText) {
        articleText = await fetchArticleContentFromUrl(sourceUrl);
    }

    try {
        const [contentAnalysis, sourceAnalysis] = await Promise.all([
            articleText ? analyzeNewsContent({ articleText }) : Promise.resolve(null),
            sourceUrl ? analyzeNewsSource({ sourceUrl }) : Promise.resolve(null),
        ]);
        
        let correctiveNews: ProvideCorrectiveNewsOutput | null = null;
        if (contentAnalysis && articleText && contentAnalysis.credibilityScore < 0.6 && !contentAnalysis.isCreatorQuery) {
            correctiveNews = await provideCorrectiveNews({ fakeNews: articleText });
        }

        const result: AnalysisResult = {
            contentAnalysis,
            sourceAnalysis,
            correctiveNews,
        };

        if (contentAnalysis?.isCreatorQuery || isRohithQuery) {
            result.creatorDetails = {
                name: "Rohith P",
                role: "Founder & Executive Manager at Zaya Group of Company",
                education: "Student of AI & Machine Learning at Sona College of Technology",
                bio: "Rohith P is the visionary behind TruthSeeker. Combining his management expertise at Zaya Group with his advanced studies in AI and Machine Learning at Sona College of Technology, he built this platform to combat misinformation using state-of-the-art Generative AI."
            };
        }

        return result;
    } catch (error: any) {
        const message = error.message || "";
        if (message.includes('429')) {
            throw new Error("AI quota reached. Please wait a moment before trying again.");
        }
        if (message.includes('404')) {
            throw new Error("AI Service configuration issue. We are automatically adjusting. Please try one more time.");
        }
        throw error;
    }
}
