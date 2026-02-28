'use server';
/**
 * @fileOverview A Genkit flow for generating AI-driven eco insights for the Waste2Product platform.
 *
 * - generateEcoInsights - A function that handles the generation of environmental insights.
 * - AiDrivenEcoInsightsInput - The input type for the generateEcoInsights function.
 * - AiDrivenEcoInsightsOutput - The return type for the generateEcoInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiDrivenEcoInsightsInputSchema = z.object({});
export type AiDrivenEcoInsightsInput = z.infer<typeof AiDrivenEcoInsightsInputSchema>;

const AiDrivenEcoInsightsOutputSchema = z.object({
  wasteTrendPrediction: z.string().describe('A summary of waste trend predictions, e.g., "Plastic waste increased 12% this month."'),
  mostRecycledCategory: z.string().describe('The most recycled waste category, e.g., "Paper recycling demand rising."'),
  userBehaviorAnalysis: z.string().describe('An analysis of user recycling behavior, e.g., "Top 5% users contributing 40% waste."'),
  wasteGrowthForecast: z.string().describe('A forecast for waste growth trends.'),
  carbonReductionProjection: z.string().describe('A projection of carbon reduction based on recycling efforts.'),
  insightCards: z.array(z.string()).describe('A list of 3-4 short, impactful insight messages for animated cards.'),
});
export type AiDrivenEcoInsightsOutput = z.infer<typeof AiDrivenEcoInsightsOutputSchema>;

export async function generateEcoInsights(input: AiDrivenEcoInsightsInput): Promise<AiDrivenEcoInsightsOutput> {
  return aiDrivenEcoInsightsFlow(input);
}

const ecoInsightsPrompt = ai.definePrompt({
  name: 'ecoInsightsPrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: AiDrivenEcoInsightsInputSchema },
  output: { schema: AiDrivenEcoInsightsOutputSchema },
  prompt: `You are an AI analytics module for "Waste2Product – Circular E-Commerce Platform".
Your task is to generate insightful environmental analytics and projections for users.
Provide simulated insights based on typical circular economy data.

Generate the following:
1.  wasteTrendPrediction: A sentence summarizing a waste trend.
2.  mostRecycledCategory: A sentence about the most recycled category.
3.  userBehaviorAnalysis: A sentence analyzing user behavior.
4.  wasteGrowthForecast: A sentence forecasting waste growth.
5.  carbonReductionProjection: A sentence projecting carbon reduction.
6.  insightCards: A list of 3-4 short, impactful insight messages for animated cards.

Example insights to inspire your response:
- "Plastic waste increased 12% this month."
- "Paper recycling demand rising."
- "Top 5% users contributing 40% waste."

Ensure all outputs are distinct and relevant to environmental impact and circular economy.`,
});

const aiDrivenEcoInsightsFlow = ai.defineFlow(
  {
    name: 'aiDrivenEcoInsightsFlow',
    inputSchema: AiDrivenEcoInsightsInputSchema,
    outputSchema: AiDrivenEcoInsightsOutputSchema,
  },
  async input => {
    const { output } = await ecoInsightsPrompt(input);
    return output!;
  }
);
