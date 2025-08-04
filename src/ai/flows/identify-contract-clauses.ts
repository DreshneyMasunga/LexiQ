'use server';
/**
 * @fileOverview This file defines a Genkit flow for identifying key clauses in a contract PDF.
 *
 * The flow takes a PDF data URI as input and returns a list of identified clauses.
 * Each clause includes its type (e.g., 'Termination', 'Liability') and the corresponding text.
 *
 * @exported identifyContractClauses - The main function to trigger the clause identification flow.
 * @exported IdentifyContractClausesInput - The input type for the identifyContractClauses function.
 * @exported IdentifyContractClausesOutput - The return type for the identifyContractClauses function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyContractClausesInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      "A contract PDF as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyContractClausesInput = z.infer<typeof IdentifyContractClausesInputSchema>;

const IdentifiedClauseSchema = z.object({
  type: z.string().describe('The type of the clause (e.g., Termination, Liability).'),
  text: z.string().describe('The text of the clause.'),
});

const IdentifyContractClausesOutputSchema = z.object({
  clauses: z.array(IdentifiedClauseSchema).describe('A list of identified clauses in the contract.'),
  language: z.string().describe('The primary language of the document (e.g., "English", "Spanish").'),
});
export type IdentifyContractClausesOutput = z.infer<typeof IdentifyContractClausesOutputSchema>;

export async function identifyContractClauses(
  input: IdentifyContractClausesInput
): Promise<IdentifyContractClausesOutput> {
  return identifyContractClausesFlow(input);
}

const identifyContractClausesPrompt = ai.definePrompt({
  name: 'identifyContractClausesPrompt',
  input: {schema: IdentifyContractClausesInputSchema},
  output: {schema: IdentifyContractClausesOutputSchema},
  prompt: `You are an expert legal document analyst.

  Your task is to analyze the contract provided.
  1. Identify the primary language of the document.
  2. Identify key clauses such as Termination, Liability, Payment Terms, Intellectual Property, and Confidentiality.
  3. For each identified clause, extract the clause type and the corresponding text.
  
  Return the identified clauses and the detected language in JSON format.

  Contract PDF: {{media url=pdfDataUri}}`,
});

const identifyContractClausesFlow = ai.defineFlow(
  {
    name: 'identifyContractClausesFlow',
    inputSchema: IdentifyContractClausesInputSchema,
    outputSchema: IdentifyContractClausesOutputSchema,
  },
  async input => {
    const {output} = await identifyContractClausesPrompt(input);
    return output!;
  }
);
