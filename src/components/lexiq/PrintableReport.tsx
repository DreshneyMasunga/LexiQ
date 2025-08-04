import type { AnalysisResult } from '@/app/page';
import { Gavel } from 'lucide-react';

export function PrintableReport({ analysis }: { analysis: AnalysisResult }) {
    const getRiskColorClass = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'high':
                return 'bg-destructive text-destructive-foreground';
            case 'medium':
                return 'bg-accent text-accent-foreground';
            case 'low':
                return 'bg-primary text-primary-foreground';
            default:
                return 'bg-muted text-muted-foreground';
        }
    };

    return (
        <div className="hidden print:block">
            <div className="p-8 font-body">
                <header className="flex items-center mb-12 pb-4 border-b">
                    <Gavel className="w-10 h-10 text-primary" />
                    <h1 className="ml-4 text-4xl font-bold font-headline">LexiQ Contract Analysis Report</h1>
                </header>

                <section className="mb-8">
                    <h2 className="text-2xl font-bold font-headline border-b pb-2 mb-4">Document Information</h2>
                    <p><span className="font-semibold">File Name:</span> {analysis.fileName}</p>
                    <p><span className="font-semibold">Analysis Date:</span> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </section>

                <section className="page-break-before">
                    <h2 className="text-2xl font-bold font-headline border-b pb-2 mb-4">Risk Assessment Summary</h2>
                    {analysis.risks.length > 0 ? (
                        <div className="space-y-6">
                            {analysis.risks.map((risk, index) => (
                                <div key={index} className="pb-6 border-b last:border-b-0">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold font-headline">Potential Risk #{index + 1}</h3>
                                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getRiskColorClass(risk.severity)}`}>
                                            {risk.severity.charAt(0).toUpperCase() + risk.severity.slice(1)} Risk
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-semibold text-muted-foreground">Explanation of Risk</h4>
                                            <p>{risk.explanation}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-muted-foreground">Associated Clause Text</h4>
                                            <blockquote className="mt-1 border-l-4 border-border pl-4 italic bg-muted/50 p-3 rounded-r-md">{risk.clause}</blockquote>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-muted/50 p-6 rounded-lg text-center">
                            <h3 className="text-lg font-semibold">No Significant Risks Identified</h3>
                            <p className="text-muted-foreground">Our AI analysis did not identify any high or medium-risk clauses. We still recommend a professional legal review for any contract.</p>
                        </div>
                    )}
                </section>

                <section className="page-break-before">
                    <h2 className="text-2xl font-bold font-headline border-b pb-2 mb-4">Identified Clauses</h2>
                     <div className="space-y-6">
                        {analysis.clauses.map((clause, index) => (
                            <div key={index} className="pb-6 border-b last:border-b-0">
                                <h3 className="text-xl font-bold font-headline mb-2">{clause.type}</h3>
                                <p className="text-muted-foreground leading-relaxed">{clause.text}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
