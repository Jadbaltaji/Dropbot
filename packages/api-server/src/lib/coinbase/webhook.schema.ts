import z from 'zod';

export const CoinbaseCommerceWebhookSchema = z.object({
  id: z.string(),
  scheduled_for: z.string(),
  event: z.object({
    id: z.string(),
    resource: z.string(),
    type: z.string(),
    api_version: z.string(),
    created_at: z.string(),
    data: z.object({
      code: z.string(),
      name: z.string(),
      description: z.string(),
      hosted_url: z.string(),
      created_at: z.string(),
      expires_at: z.string(),
      timeline: z.array(z.object({ time: z.string(), status: z.string() })),
      metadata: z.object({
        packageId: z.string(),
        userId: z.string(),
      }),
      pricing_type: z.string(),
      payments: z.array(z.unknown()),
      addresses: z.object({ bitcoin: z.string(), ethereum: z.string() }),
    }),
  }),
});
