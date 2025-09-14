import { config } from 'dotenv';
config();

import '@/ai/flows/assign-department-and-urgency.ts';
import '@/ai/flows/ai-assistant-document-understanding.ts';
import '@/ai/flows/summarize-uploaded-document.ts';