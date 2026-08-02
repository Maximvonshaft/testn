import { z } from 'astro/zod';

export const leadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().max(180).optional().default(''),
  country: z.string().trim().min(2).max(120),
  projectType: z.string().trim().min(2).max(80),
  application: z.string().trim().min(2).max(120),
  finishes: z.string().trim().max(240).optional().default(''),
  message: z.string().trim().max(1500).optional().default(''),
  consent: z.literal(true),
  locale: z.enum(['en', 'de', 'fr', 'cnr']).default('en'),
  website: z.string().max(0).optional().default(''),
  turnstileToken: z.string().max(2048).optional().default(''),
});

export type LeadInput = z.infer<typeof leadSchema>;

export function publicLead(input: LeadInput, requestId: string, receivedAt: string) {
  const { website: _website, turnstileToken: _turnstileToken, ...lead } = input;
  return { ...lead, requestId, receivedAt, source: 'aquastone-website' as const };
}
