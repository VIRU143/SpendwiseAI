// src/app/api/genkit/[...flow]/route.ts

import {createApiHandler} from '@genkit-ai/next';
import '@/ai/flows/analyze-receipt';
import '@/ai/flows/categorize-expense';

export const {GET, POST} = createApiHandler();
