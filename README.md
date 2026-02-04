# TruthSeeker - AI Fact-Checker

This is a Next.js application built with Firebase Studio that acts as an AI-powered fact-checker.

## Features

- **Analyze News by URL or Text:** Users can either paste the URL of a news article or the full text content.
- **Content Credibility Analysis:** The app uses a Genkit AI flow to analyze the article's content for indicators of misinformation, providing a credibility score.
- **Source Reliability Analysis:** It assesses the reliability and potential bias of the news source (if a URL is provided).
- **Corrective Information:** For articles with low credibility, the app provides links to verified, accurate sources on the topic.
- **Futuristic UI:** The interface is styled with a dark, neon-noir "cyberpunk" theme.

## Getting Started

The main application logic is in `src/app/page.tsx`. The AI flows are located in `src/ai/flows/`.

### To run locally:

1.  Install dependencies: `npm install`
2.  Run the development server: `npm run dev`

The app will be available at `http://localhost:9002`.
