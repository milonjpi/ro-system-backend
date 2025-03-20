import { z } from 'zod';

const create = z.object({
  body: z.object({
    year: z.string({ required_error: 'Year is Required' }),
    recipientId: z.string({ required_error: 'Recipient ID is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    year: z.string().optional(),
    recipientId: z.string().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const ZakatValidation = {
  create,
  update,
};
