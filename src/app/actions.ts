'use server';

import { identifyContractClauses } from '@/ai/flows/identify-contract-clauses';
import { assessContractRisk } from '@/ai/flows/assess-contract-risk';

type ActionInput = {
  pdfDataUri: string;
};

export async function analyzeContractAction(input: ActionInput) {
  try {
    const { pdfDataUri } = input;
    
    const clauseIdentificationResult = await identifyContractClauses({ pdfDataUri });
    const { clauses } = clauseIdentificationResult;

    if (!clauses || clauses.length === 0) {
      return { error: 'No clauses were identified in the document. The document might be empty, unreadable, or not a valid contract.' };
    }
    
    const contractText = clauses.map(clause => `Clause Type: ${clause.type}\nText: ${clause.text}`).join('\n\n---\n\n');

    const riskAssessmentResult = await assessContractRisk({ contractText });
    const { riskAssessment: risks } = riskAssessmentResult;

    return {
      clauses,
      risks,
    };
  } catch (error) {
    console.error('Error in analyzeContractAction:', error);
    return { error: 'Failed to analyze the contract. Please ensure it is a valid PDF and try again.' };
  }
}
