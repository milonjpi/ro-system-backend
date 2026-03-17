import { z } from 'zod';

const create = z.object({
  body: z.object({
    year: z.string({ required_error: 'Year is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    year: z.string().optional(),
    amount: z.number().optional(),
  }),
});

export const ZakatValueValidation = {
  create,
  update,
};
