"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getAnalysis, type AnalysisResult } from '@/app/actions';
import { AnalysisReport } from '@/app/components/analysis-report';
import { LoadingSkeleton } from '@/app/components/loading-skeleton';

const formSchema = z.object({
  articleText: z.string().optional(),
  sourceUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
}).refine(data => !!data.articleText || !!data.sourceUrl, {
  message: "Please enter either article text or a URL.",
  path: ["articleText"], // Show error on one of the fields
});

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      articleText: "",
      sourceUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const result = await getAnalysis(values);
      setAnalysisResult(result);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8 md:py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="shadow-lg backdrop-blur-sm bg-card/70 border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-glow-primary text-3d">Fake News Detector</CardTitle>
            <CardDescription>Enter a news article URL or paste its content to analyze its credibility.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="sourceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>News URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/news-article" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                      Or
                    </span>
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="articleText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Article Text</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Paste the content of the news article here..."
                          className="min-h-[150px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze News"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-8">
          {isLoading && <LoadingSkeleton />}
          {analysisResult && <AnalysisReport result={analysisResult} />}
        </div>
      </div>
    </div>
  );
}
