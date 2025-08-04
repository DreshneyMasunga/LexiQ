'use server';

/**
 * @fileOverview A contract risk assessment AI agent.
 *
 * - assessContractRisk - A function that handles the contract risk assessment process.
 * - AssessContractRiskInput - The input type for the assessContractRisk function.
 * - AssessContractRiskOutput - The return type for the assessContractRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssessContractRiskInputSchema = z.object({
  contractText: z.string().describe('The text of the contract to assess.'),
  language: z.string().describe('The language of the contract (e.g., "English", "Spanish").'),
});
export type AssessContractRiskInput = z.infer<typeof AssessContractRiskInputSchema>;

const AssessContractRiskOutputSchema = z.object({
  riskAssessment: z.array(
    z.object({
      clause: z.string().describe('The specific clause identified as risky.'),
      riskCategory: z.enum([
          "Ambiguous Terms",
          "Indemnity Risk",
          "Liability Concerns",
          "One-sided Clauses",
          "Unfair Termination",
          "Payment Issues",
          "Confidentiality Gaps",
          "Other",
        ]).describe('The category of the identified risk.'),
      explanation: z.string().describe('An explanation of the potential risk associated with the clause.'),
      suggestion: z.string().describe('Actionable suggestion or alternative wording to mitigate the risk.'),
      severity: z.enum(['low', 'medium', 'high']).describe('The severity level of the risk.'),
    })
  ).describe('An array of risk assessments for the contract.'),
});
export type AssessContractRiskOutput = z.infer<typeof AssessContractRiskOutputSchema>;

export async function assessContractRisk(input: AssessContractRiskInput): Promise<AssessContractRiskOutput> {
  return assessContractRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assessContractRiskPrompt',
  input: {schema: AssessContractRiskInputSchema},
  output: {schema: AssessContractRiskOutputSchema},
  prompt: `You are an AI legal assistant specializing in contract risk assessment. The contract is written in {{{language}}}. Analyze the provided contract text and identify potentially risky or problematic language.

For each identified risk, you must:
1. Categorize the risk into one of the following categories: "Ambiguous Terms", "Indemnity Risk", "Liability Concerns", "One-sided Clauses", "Unfair Termination", "Payment Issues", "Confidentiality Gaps", or "Other".
2. Provide a clear explanation of the potential issue.
3. Suggest an actionable next step, such as alternative clause wording, to mitigate the risk.
4. Assign a severity level: low, medium, or high.
5. Respond in {{{language}}}.

Contract Text:
{{{contractText}}}
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
    ],
  },
});

const assessContractRiskFlow = ai.defineFlow(
  {
    name: 'assessContractRiskFlow',
    inputSchema: AssessContractRiskInputSchema,
    outputSchema: AssessContractRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
