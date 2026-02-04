import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { Header } from '@/app/components/header';
import { Toaster } from "@/components/ui/toaster";


export const metadata: Metadata = {
  title: 'TruthSeeker | AI Fact-Checker',
  description: 'Analyze news articles for credibility and detect fake news with the power of AI.',
};

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});
const fontHeadline = Orbitron({
  subsets: ['latin'],
  weight: '700',
  display: 'swap',
  variable: '--font-orbitron',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning className={`${fontBody.variable} ${fontHeadline.variable}`}>
      <head />
      <body className={cn("font-body antialiased min-h-screen")}>
        <div
            className="fixed inset-0 z-[-1] bg-cover bg-center"
            style={{
                backgroundImage: "url('https://storage.googleapis.com/project-123-files/user/53b89981-4475-4303-9d7a-350730b6b0c2.png')",
            }}
        />
        <div className="relative flex min-h-screen flex-col bg-background/90">
          {/* Decorative HUD elements */}
          <div className="absolute inset-0 z-0 pointer-events-none">
              {/* Corner brackets */}
              <div className="absolute top-8 left-8 w-24 h-24 border-l-2 border-t-2 border-primary/20 rounded-tl-xl" />
              <div className="absolute top-8 right-8 w-24 h-24 border-r-2 border-t-2 border-primary/20 rounded-tr-xl" />
              <div className="absolute bottom-8 left-8 w-24 h-24 border-l-2 border-b-2 border-primary/20 rounded-bl-xl" />
              <div className="absolute bottom-8 right-8 w-24 h-24 border-r-2 border-b-2 border-primary/20 rounded-br-xl" />

              {/* Text elements */}
              <span className="absolute bottom-8 left-40 font-code text-xs text-primary/30 text-glow-primary/30">
                  STATUS: SECURE CONNECTION
              </span>
              <span className="absolute top-8 right-40 font-code text-xs text-primary/30 text-glow-primary/30">
                  TRUTHSEEKER v1.0 // AI CORE ONLINE
              </span>
          </div>
          
          <Header />
          <main className="flex-1 relative z-10">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
