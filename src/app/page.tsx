'use client';

import { useState } from 'react';
import type { IdentifyContractClausesOutput } from '@/ai/flows/identify-contract-clauses';
import type { AssessContractRiskOutput } from '@/ai/flows/assess-contract-risk';

import { Header } from '@/components/lexiq/Header';
import { FileUploader } from '@/components/lexiq/FileUploader';
import { AnalysisView } from '@/components/lexiq/AnalysisView';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { analyzeContractAction } from '@/app/actions';

export type AnalysisResult = {
  clauses: IdentifyContractClausesOutput['clauses'];
  risks: AssessContractRiskOutput['riskAssessment'];
  fileName: string;
};

export default function Home() {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileAnalysis = async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setAnalysis(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const pdfDataUri = reader.result as string;
      try {
        const result = await analyzeContractAction({ pdfDataUri });
        if (result.error) {
          throw new Error(result.error);
        }
        setAnalysis({ ...result, fileName: file.name } as AnalysisResult);
      } catch (e: any) {
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: e.message || 'An unknown error occurred during the analysis.',
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'There was an error reading the selected file.',
      });
      setIsLoading(false);
    };
  };

  const handleReset = () => {
    setAnalysis(null);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {analysis ? (
            <AnalysisView analysis={analysis} onReset={handleReset} />
          ) : (
            <FileUploader onFileUpload={handleFileAnalysis} isLoading={isLoading} />
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground">
        <p>LexiQ Contract Analysis. For informational purposes only. Not legal advice. By Dreshney Masunga</p>
      </footer>
      <Toaster />
    </div>
  );
}
