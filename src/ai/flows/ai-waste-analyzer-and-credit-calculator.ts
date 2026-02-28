'use server';
/**
 * @fileOverview A Genkit flow for the AI Waste Analyzer & Credit Calculator.
 * This file defines the AI logic to classify waste from an image, assess its quality,
 * and calculate Green Credits based on the detected waste type, quality, and weight.
 *
 * - aiWasteAnalyzerAndCreditCalculator - The main function to trigger the AI analysis and credit calculation.
 * - AiWasteAnalyzerInput - The input type for the analysis.
 * - AiWasteAnalyzerOutput - The output type after analysis and calculation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// 1. Define Input Schema
const AiWasteAnalyzerInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the waste, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  selectedCategory: z
    .enum(['Paper', 'Plastic', 'Metal', 'E-waste'])
    .describe('The user-selected category for the waste.'),
  weightKg: z
    .number()
    .min(0.01)
    .describe('The weight of the waste in kilograms.'),
});
export type AiWasteAnalyzerInput = z.infer<typeof AiWasteAnalyzerInputSchema>;

// Schema for the AI's classification output (before credit calculation)
const AiClassificationOutputSchema = z.object({
  wasteType: z
    .enum(['Paper', 'Plastic', 'Metal', 'E-waste'])
    .describe('The AI-detected type of waste.'),
  qualityScore: z
    .number()
    .min(0)
    .max(1)
    .describe(
      'A quality score for the waste, ranging from 0 (very poor) to 1 (excellent).'
    ),
  contamination: z
    .number()
    .min(0)
    .max(100)
    .describe('The percentage of contamination in the waste.'),
});

// 2. Define Output Schema
const AiWasteAnalyzerOutputSchema = AiClassificationOutputSchema.extend({
  greenCredits: z.number().describe('The calculated Green Credits for the waste.'),
});
export type AiWasteAnalyzerOutput = z.infer<typeof AiWasteAnalyzerOutputSchema>;

// 3. Define waste rates
const wasteRates: Record<
  'paper' | 'plastic' | 'metal' | 'e-waste',
  number
> = {
  paper: 12,
  plastic: 10,
  metal: 25,
  'e-waste': 30,
};

// 4. Define the prompt for AI classification
const classifyWastePrompt = ai.definePrompt({
  name: 'classifyWastePrompt',
  model: 'googleai/gemini-2.5-flash',
  input: { schema: AiWasteAnalyzerInputSchema },
  output: { schema: AiClassificationOutputSchema },
  prompt: `You are an expert AI waste classification system. Your task is to analyze the provided image of waste and the user's selected category to determine the actual waste type, its quality score, and the contamination percentage.
Consider the visual cues in the image to estimate the quality and contamination.

User provided information:
Selected Category: {{{selectedCategory}}}
Weight: {{{weightKg}}} kg
Photo: {{media url=photoDataUri}}

Output your classification in JSON format. Ensure the 'wasteType' is one of 'Paper', 'Plastic', 'Metal', or 'E-waste'.
The 'qualityScore' should be a number between 0 and 1, where 1 is perfect quality.
The 'contamination' should be a number between 0 and 100, representing a percentage.`,
});

// 5. Define the Genkit Flow
const aiWasteAnalyzerAndCreditCalculatorFlow = ai.defineFlow(
  {
    name: 'aiWasteAnalyzerAndCreditCalculatorFlow',
    inputSchema: AiWasteAnalyzerInputSchema,
    outputSchema: AiWasteAnalyzerOutputSchema,
  },
  async (input) => {
    // Call the prompt to get AI classification
    const { output: classificationOutput } = await classifyWastePrompt(input);

    if (!classificationOutput) {
      throw new Error('AI classification failed to provide output. Please ensure the image is clear.');
    }

    // Ensure the wasteType from LLM matches our rates keys (case insensitive)
    const detectedWasteTypeKey = classificationOutput.wasteType.toLowerCase() as
      | 'paper'
      | 'plastic'
      | 'metal'
      | 'e-waste';
    const rate = wasteRates[detectedWasteTypeKey];

    if (rate === undefined) {
      throw new Error(`Invalid waste type detected by AI: ${classificationOutput.wasteType}`);
    }

    // Calculate Green Credits
    const greenCredits =
      rate * input.weightKg * classificationOutput.qualityScore;

    return {
      ...classificationOutput,
      greenCredits,
    };
  }
);

// 6. Define the exported wrapper function
export async function aiWasteAnalyzerAndCreditCalculator(
  input: AiWasteAnalyzerInput
): Promise<AiWasteAnalyzerOutput> {
  return aiWasteAnalyzerAndCreditCalculatorFlow(input);
}
