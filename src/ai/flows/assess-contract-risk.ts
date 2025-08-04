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
});
export type AssessContractRiskInput = z.infer<typeof AssessContractRiskInputSchema>;

const AssessContractRiskOutputSchema = z.object({
  riskAssessment: z.array(
    z.object({
      clause: z.string().describe('The specific clause identified as risky.'),
      explanation: z.string().describe('An explanation of the potential risk associated with the clause.'),
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
  prompt: `You are an AI legal assistant specializing in contract risk assessment. Analyze the provided contract text and identify potentially risky or problematic language. Provide a risk assessment for each identified clause, including an explanation of the potential risk and a severity level (low, medium, or high).

Contract Text:
{{{contractText}}}

Format your output as a JSON array of risk assessments, where each assessment includes the clause, explanation, and severity.
`, config: {
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
