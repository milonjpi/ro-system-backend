import { z } from 'zod';

const create = z.object({
  body: z.object({
    sourceId: z.string().optional().nullable(),
    date: z.string({ required_error: 'Date is Required' }),
    year: z.string({ required_error: 'Year is Required' }),
    month: z.string({ required_error: 'Month is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    sourceId: z.string().optional().nullable(),
    date: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const OpeningBalanceValidation = {
  create,
  update,
};
