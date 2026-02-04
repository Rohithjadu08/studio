import type { FC } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Link as LinkIcon, Newspaper, Shield, ThumbsDown, ThumbsUp, TrendingUp, XCircle } from 'lucide-react';
import type { AnalysisResult } from '@/app/actions';

const getScoreColorClass = (score: number) => {
    if (score < 0.4) return 'red';
    if (score < 0.7) return 'yellow';
    return 'green';
};

const CredibilityScore: FC<{ score: number }> = ({ score }) => {
    const scoreColor = getScoreColorClass(score);
    const colorClasses = {
        red: {
            progress: '[&>*]:bg-red-500',
            text: 'text-red-500',
        },
        yellow: {
            progress: '[&>*]:bg-yellow-500',
            text: 'text-yellow-500',
        },
        green: {
            progress: '[&>*]:bg-accent',
            text: 'text-accent',
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="text-primary" />
                    Overall Credibility Score
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                    <Progress value={score * 100} className={`h-3 ${colorClasses[scoreColor].progress}`} />
                    <span className={`text-2xl font-bold font-mono ${colorClasses[scoreColor].text}`}>{`${Math.round(score * 100)}%`}</span>
                </div>
                <p className="text-sm text-muted-foreground">
                    This score represents the AI's confidence in the article's credibility based on its content and source.
                </p>
            </CardContent>
        </Card>
    );
};

export const AnalysisReport: FC<{ result: AnalysisResult }> = ({ result }) => {
  const { contentAnalysis, sourceAnalysis, correctiveNews } = result;

  const overallScore = contentAnalysis?.credibilityScore ?? sourceAnalysis?.reliabilityScore ?? 0;

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-500">
      <CredibilityScore score={overallScore} />

      <Accordion type="multiple" defaultValue={['content-analysis', 'source-analysis']} className="w-full space-y-4">
        {contentAnalysis && (
          <Card>
            <AccordionItem value="content-analysis" className="border-b-0">
              <AccordionTrigger className="p-6 text-lg font-headline hover:no-underline">
                <div className="flex items-center gap-3">
                  <Newspaper className="w-6 h-6 text-primary" />
                  Content Analysis
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-4">
                {contentAnalysis.fakeNewsIndicators.length > 0 ? (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertTitle>Potential Misinformation Indicators Found</AlertTitle>
                    <AlertDescription>
                      <ul className="list-disc pl-5 space-y-1 mt-2">
                        {contentAnalysis.fakeNewsIndicators.map((indicator, i) => (
                          <li key={i}>{indicator}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="border-accent/50 text-accent-foreground dark:border-accent">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    <AlertTitle>No Major Indicators Found</AlertTitle>
                    <AlertDescription>
                      The article's content does not show common signs of misinformation.
                    </AlertDescription>
                  </Alert>
                )}
                
                <h3 className="font-semibold pt-4 border-t">Fact-Checking Report</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap font-sans">{contentAnalysis.factCheckingReport}</p>
              </AccordionContent>
            </AccordionItem>
          </Card>
        )}

        {sourceAnalysis && (
          <Card>
            <AccordionItem value="source-analysis" className="border-b-0">
              <AccordionTrigger className="p-6 text-lg font-headline hover:no-underline">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-primary" />
                  Source Analysis
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Reliability Score</h4>
                      <div className="flex items-center gap-2">
                         <Progress value={sourceAnalysis.reliabilityScore * 100} className="h-2 [&>*]:bg-primary" />
                         <span className="font-bold text-sm text-primary">{Math.round(sourceAnalysis.reliabilityScore * 100)}%</span>
                      </div>
                    </div>
                     <div>
                      <h4 className="font-semibold text-sm mb-1">Fact Checking Reputation</h4>
                      <p className="text-sm text-muted-foreground">{sourceAnalysis.factCheckingReputation}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Bias Assessment</h4>
                    <p className="text-sm text-muted-foreground">{sourceAnalysis.biasAssessment}</p>
                  </div>
                   <div>
                    <h4 className="font-semibold text-sm mb-1">Ownership Information</h4>
                    <p className="text-sm text-muted-foreground">{sourceAnalysis.ownershipInformation}</p>
                  </div>
              </AccordionContent>
            </AccordionItem>
          </Card>
        )}
      </Accordion>

      {correctiveNews && correctiveNews.correctiveNewsLinks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle2 className="text-accent" />
                Corrective Information
            </CardTitle>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">Here are some verified sources with accurate information on this topic:</p>
            <div className="space-y-2">
                {correctiveNews.correctiveNewsLinks.map((link, i) => (
                    <a href={link} key={i} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline p-2 rounded-md hover:bg-primary/10 transition-colors">
                        <LinkIcon className="w-4 h-4"/>
                        <span className="truncate">{link}</span>
                    </a>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm font-medium">Was this analysis helpful?</p>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm"><ThumbsUp className="w-4 h-4 mr-2"/>Yes</Button>
                <Button variant="outline" size="sm"><ThumbsDown className="w-4 h-4 mr-2"/>No</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
};
