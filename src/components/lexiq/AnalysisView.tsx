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
  if (lowerType.includes('termination')) return <Gavel className="h-5 w-5 text-red-500" />;
  if (lowerType.includes('liability')) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
  if (lowerType.includes('payment')) return <ShieldCheck className="h-5 w-5 text-green-500" />;
  if (lowerType.includes('intellectual property')) return <FileType className="h-5 w-5 text-blue-500" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
};

const RiskBadge = ({ severity }: { severity: string }) => {
  const lowerSeverity = severity.toLowerCase();
  switch (lowerSeverity) {
    case 'high':
      return <Badge variant="destructive" className="text-base">High Risk</Badge>;
    case 'medium':
      return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50 hover:bg-yellow-500/30 text-base">Medium Risk</Badge>;
    case 'low':
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/50 hover:bg-green-500/30 text-base">Low Risk</Badge>;
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
            <h1 className="text-3xl font-bold tracking-tight">Analysis Complete</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <FileText className="h-4 w-4" />
              {analysis.fileName}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
              <Button variant="secondary" onClick={onReset}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Analyze Another
              </Button>
              <Button onClick={handlePrint}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
              </Button>
          </div>
        </div>

        <Card className="bg-secondary/50 border-white/10 shadow-lg">
          <Tabs defaultValue="risk-assessment" className="w-full">
            <div className="p-4 md:p-6 border-b border-white/10">
              <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 h-auto md:h-12 text-base">
                  <TabsTrigger value="risk-assessment">
                      <AlertTriangle className="mr-2 h-5 w-5" />
                      Risk Assessment ({analysis.risks.length})
                  </TabsTrigger>
                  <TabsTrigger value="identified-clauses">
                      <FileText className="mr-2 h-5 w-5" />
                      Identified Clauses ({analysis.clauses.length})
                  </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="risk-assessment" className="p-4 md:p-6">
              <div className="space-y-4">
                {analysis.risks.length > 0 ? (
                  analysis.risks.map((risk, index) => (
                    <Card key={index} className="bg-background/80 border-white/10 shadow-md">
                      <CardHeader>
                        <div className="flex flex-col-reverse sm:flex-row justify-between items-start gap-2">
                          <CardTitle className="text-xl flex items-center gap-3">
                            Potential Risk Identified
                          </CardTitle>
                          <RiskBadge severity={risk.severity} />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div>
                              <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Explanation</h4>
                              <p className="text-foreground/90">{risk.explanation}</p>
                          </div>
                          <div>
                              <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">Associated Clause Text</h4>
                              <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground bg-secondary/40 py-2 px-4 rounded-r-md">
                                {risk.clause}
                              </blockquote>
                          </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-16 rounded-lg bg-secondary/40 border border-dashed border-green-500/50">
                    <ShieldCheck className="mx-auto h-16 w-16 text-green-500" />
                    <h3 className="mt-6 text-xl font-medium">No Major Risks Found</h3>
                    <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
                      Our AI analysis did not identify any high-risk clauses. We still recommend a professional legal review.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="identified-clauses" className="p-4 md:p-6">
                <Accordion type="single" collapsible className="w-full">
                    {analysis.clauses.map((clause, index) => (
                    <AccordionItem value={`item-${index}`} key={index} className="border-b-white/10">
                        <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-secondary/80 p-2 rounded-md"><ClauseIcon type={clause.type} /></div>
                            <span className="font-semibold text-lg">{clause.type}</span>
                        </div>
                        </AccordionTrigger>
                        <AccordionContent className="text-base leading-relaxed text-muted-foreground pl-16">
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
