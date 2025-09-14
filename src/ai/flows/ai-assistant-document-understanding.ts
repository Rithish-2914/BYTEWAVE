'use server';

/**
 * @fileOverview AI assistant for document understanding, providing summaries and answers in English and Malayalam.
 *
 * - aiAssistantDocumentUnderstanding - A function that handles the document understanding process.
 * - AiAssistantDocumentUnderstandingInput - The input type for the aiAssistantDocumentUnderstanding function.
 * - AiAssistantDocumentUnderstandingOutput - The return type for the aiAssistantDocumentUnderstanding function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { googleAI } from '@genkit-ai/googleai';
import wav from 'wav';

const AiAssistantDocumentUnderstandingInputSchema = z.object({
  documentText: z.string().describe('The text content of the document to understand.'),
  query: z.string().describe('The user query or request related to the document.'),
  language: z.enum(['en', 'ml']).describe('The desired language for the response (en: English, ml: Malayalam).'),
  responseType: z.enum(['text', 'audio']).describe('The desired response type (text or audio).'),
});
export type AiAssistantDocumentUnderstandingInput = z.infer<typeof AiAssistantDocumentUnderstandingInputSchema>;

const AiAssistantDocumentUnderstandingOutputSchema = z.object({
  response: z.string().describe('The AI assistant response in the desired language and format.'),
});
export type AiAssistantDocumentUnderstandingOutput = z.infer<typeof AiAssistantDocumentUnderstandingOutputSchema>;

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

export async function aiAssistantDocumentUnderstanding(input: AiAssistantDocumentUnderstandingInput): Promise<AiAssistantDocumentUnderstandingOutput> {
  return aiAssistantDocumentUnderstandingFlow(input);
}

const aiAssistantDocumentUnderstandingPrompt = ai.definePrompt({
  name: 'aiAssistantDocumentUnderstandingPrompt',
  input: {schema: AiAssistantDocumentUnderstandingInputSchema},
  output: {schema: AiAssistantDocumentUnderstandingOutputSchema},
  prompt: `You are an AI assistant specializing in understanding documents.  A user has uploaded a document and asked a question about it.  Answer the question using the document content.

Document Content: {{{documentText}}}

User Query: {{{query}}}

Desired Language: {{{language}}}

Desired Response Type: {{{responseType}}}

Provide a concise and informative answer in the desired language. If the desired response type is audio, provide the text that will be converted to speech.
`,
});

const aiAssistantDocumentUnderstandingFlow = ai.defineFlow(
  {
    name: 'aiAssistantDocumentUnderstandingFlow',
    inputSchema: AiAssistantDocumentUnderstandingInputSchema,
    outputSchema: AiAssistantDocumentUnderstandingOutputSchema,
  },
  async input => {
    let responseText: string;
    const {output} = await aiAssistantDocumentUnderstandingPrompt(input);
    responseText = output!.response;

    if (input.language === 'ml') {
      // TODO: Add translation logic here if needed.
    }

    if (input.responseType === 'audio') {
      const { media } = await ai.generate({
        model: googleAI.model('gemini-2.5-flash-preview-tts'),
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Algenib' },
            },
          },
        },
        prompt: responseText,
      });
      if (!media) {
        throw new Error('no media returned');
      }
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      const audioResponse = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
      return { response: audioResponse };

    }

    return {response: responseText!};
  }
);
