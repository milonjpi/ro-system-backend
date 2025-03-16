import { z } from 'zod';

const create = z.object({
  body: z.object({
    year: z.string({ required_error: 'Year is Required' }),
    month: z.string({ required_error: 'Month is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    paymentSourceId: z.string({
      required_error: 'Payment Source ID is Required',
    }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
    amount: z.number().optional(),
    paymentSourceId: z.string().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const OpeningBalanceValidation = {
  create,
  update,
};
