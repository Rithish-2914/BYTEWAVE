'use server';
/**
 * @fileOverview This file defines a Genkit flow for automatically assigning a department and urgency level to uploaded documents.
 *
 * - assignDepartmentAndUrgency - A function that takes document content and returns the assigned department and urgency.
 * - AssignDepartmentAndUrgencyInput - The input type for the assignDepartmentAndUrgency function.
 * - AssignDepartmentAndUrgencyOutput - The return type for the assignDepartmentAndUrgency function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AssignDepartmentAndUrgencyInputSchema = z.object({
  documentContent: z.string().describe('The content of the document to be analyzed.'),
});
export type AssignDepartmentAndUrgencyInput = z.infer<typeof AssignDepartmentAndUrgencyInputSchema>;

const AssignDepartmentAndUrgencyOutputSchema = z.object({
  department: z.string().describe('The department to which the document should be routed.'),
  urgency: z.enum(['low', 'medium', 'high']).describe('The urgency level of the document.'),
  deadline: z.string().optional().describe('The suggested deadline for the document in ISO format, if applicable.')
});
export type AssignDepartmentAndUrgencyOutput = z.infer<typeof AssignDepartmentAndUrgencyOutputSchema>;

export async function assignDepartmentAndUrgency(input: AssignDepartmentAndUrgencyInput): Promise<AssignDepartmentAndUrgencyOutput> {
  return assignDepartmentAndUrgencyFlow(input);
}

const assignDepartmentAndUrgencyPrompt = ai.definePrompt({
  name: 'assignDepartmentAndUrgencyPrompt',
  input: {schema: AssignDepartmentAndUrgencyInputSchema},
  output: {schema: AssignDepartmentAndUrgencyOutputSchema},
  prompt: `You are an AI assistant for a metro rail company, tasked with routing documents.

  Analyze the following document content:
  {{documentContent}}

  Based on the content, determine the single most appropriate department from the list below to handle this document. For example, a document about "procurement" should go to "Finance & Accounts", and a "blueprint" should go to "Engineering & Projects".

  Also, determine the urgency level of the document (low, medium, or high).
  If a specific deadline is mentioned or can be inferred, provide it in ISO format (YYYY-MM-DD).

  Available Departments:
  - Operations
  - Engineering & Projects
  - Finance & Accounts
  - Human Resources (HR) & Administration
  - Legal Department
  - Safety & Security
  - Environment & Social Responsibility
  - Executive / Board
  - IT / Systems

  Urgency Levels: low, medium, high`,
});

const assignDepartmentAndUrgencyFlow = ai.defineFlow(
  {
    name: 'assignDepartmentAndUrgencyFlow',
    inputSchema: AssignDepartmentAndUrgencyInputSchema,
    outputSchema: AssignDepartmentAndUrgencyOutputSchema,
  },
  async input => {
    const {output} = await assignDepartmentAndUrgencyPrompt(input);
    return output!;
  }
);
