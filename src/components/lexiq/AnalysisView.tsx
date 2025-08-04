'use client';

import type { AnalysisResult } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, ShieldCheck, Gavel, FileType, Download, RotateCcw } from 'lucide-react';
import { PrintableReport } from './PrintableReport';

type AnalysisViewProps = {
  analysis: AnalysisResult;
  onReset: () => void;
};

const ClauseIcon = ({ type }: { type: string }) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('termination')) return <Gavel className="h-5 w-5 text-destructive" />;
  if (lowerType.includes('liability')) return <AlertTriangle className="h-5 w-5 text-accent" />;
  if (lowerType.includes('payment')) return <ShieldCheck className="h-5 w-5" style={{color: 'hsl(var(--chart-2))'}} />;
  if (lowerType.includes('intellectual property')) return <FileType className="h-5 w-5 text-primary" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

const RiskBadge = ({ severity }: { severity: string }) => {
  const lowerSeverity = severity.toLowerCase();
  switch (lowerSeverity) {
    case 'high':
      return <Badge variant="destructive">High Risk</Badge>;
    case 'medium':
      return <Badge className="bg-accent text-accent-foreground hover:bg-accent/80">Medium Risk</Badge>;
    case 'low':
      return <Badge style={{backgroundColor: 'hsl(var(--chart-2))', color: 'hsl(var(--primary-foreground))'}} className="border-transparent hover:opacity-80">Low Risk</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
};

export function AnalysisView({ analysis, onReset }: AnalysisViewProps) {
    const handlePrint = () => {
        window.print();
    };

  return (
    <>
      <div className="print:hidden">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Analysis Complete</h2>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4" />
              {analysis.fileName}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
              <Button variant="outline" onClick={onReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Analyze Another
              </Button>
              <Button onClick={handlePrint}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
              </Button>
          </div>
        </div>

        <Card>
          <Tabs defaultValue="risk-assessment" className="w-full">
            <div className="p-4 md:p-6 border-b">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto md:h-10">
                  <TabsTrigger value="risk-assessment">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Risk Assessment ({analysis.risks.length})
                  </TabsTrigger>
                  <TabsTrigger value="identified-clauses">
                      <FileText className="mr-2 h-4 w-4" />
                      Identified Clauses ({analysis.clauses.length})
                  </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="risk-assessment" className="p-4 md:p-6">
              <div className="space-y-4">
                {analysis.risks.length > 0 ? (
                  analysis.risks.map((risk, index) => (
                    <Card key={index} className="bg-secondary/50">
                      <CardHeader>
                        <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-2">
                          <CardTitle className="text-lg flex items-center gap-3">
                            Potential Risk Identified
                          </CardTitle>
                          <RiskBadge severity={risk.severity} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div>
                              <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Explanation</h4>
                              <p className="text-foreground">{risk.explanation}</p>
                          </div>
                          <div>
                              <h4 className="font-semibold text-sm mb-1 text-muted-foreground">Associated Clause Text</h4>
                              <blockquote className="border-l-2 pl-4 italic text-muted-foreground">
                                {risk.clause}
                              </blockquote>
                          </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 rounded-lg bg-secondary/50">
                    <ShieldCheck className="mx-auto h-12 w-12" style={{color: 'hsl(var(--chart-2))'}} />
                    <h3 className="mt-4 text-lg font-medium">No Major Risks Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
                      Our AI analysis did not identify any high-risk clauses. We still recommend a professional legal review.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="identified-clauses" className="p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                    {analysis.clauses.map((clause, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger className="hover:no-underline text-left">
                        <div className="flex items-center gap-4">
                            <ClauseIcon type={clause.type} />
                            <span className="font-semibold text-base">{clause.type}</span>
                        </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base leading-relaxed text-muted-foreground pl-14">
                            {clause.text}
                        </AccordionContent>
                    </AccordionItem>
                    ))}
                </Accordion>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      <PrintableReport analysis={analysis} />
    </>
  );
}
