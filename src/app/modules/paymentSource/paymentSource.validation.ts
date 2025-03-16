import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Payment Source is Required' }),
    limit: z.number().optional(),
    description: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    limit: z.number().optional(),
    description: z.string().optional(),
  }),
});

export const PaymentSourceValidation = {
  create,
  update,
};
