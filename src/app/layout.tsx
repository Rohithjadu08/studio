import type { Metadata } from 'next';
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from '@/app/components/header';
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'TruthSeeker | AI Fact-Checker',
  description: 'Analyze news articles for credibility and detect fake news with the power of AI.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&family=Inter:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased min-h-screen")}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
