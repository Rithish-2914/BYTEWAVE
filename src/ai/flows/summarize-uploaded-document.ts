// SummarizeUploadedDocument.ts
'use server';

/**
 * @fileOverview This file contains a Genkit flow for summarizing uploaded documents.
 *
 * - summarizeUploadedDocument - A function that takes a document (pdf, excel, image, word) as input and returns a summary of the document.
 * - SummarizeUploadedDocumentInput - The input type for the summarizeUploadedDocument function.
 * - SummarizeUploadedDocumentOutput - The return type for the summarizeUploadedDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeUploadedDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "The document to be summarized, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type SummarizeUploadedDocumentInput = z.infer<typeof SummarizeUploadedDocumentInputSchema>;

const SummarizeUploadedDocumentOutputSchema = z.object({
  summary: z.string().describe('A summary of the document.'),
});
export type SummarizeUploadedDocumentOutput = z.infer<typeof SummarizeUploadedDocumentOutputSchema>;

export async function summarizeUploadedDocument(input: SummarizeUploadedDocumentInput): Promise<SummarizeUploadedDocumentOutput> {
  return summarizeUploadedDocumentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeUploadedDocumentPrompt',
  input: {schema: SummarizeUploadedDocumentInputSchema},
  output: {schema: SummarizeUploadedDocumentOutputSchema},
  prompt: `You are an expert summarizer. Please provide a concise summary of the following document:

{{media url=documentDataUri}}`,
});

const summarizeUploadedDocumentFlow = ai.defineFlow(
  {
    name: 'summarizeUploadedDocumentFlow',
    inputSchema: SummarizeUploadedDocumentInputSchema,
    outputSchema: SummarizeUploadedDocumentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
