import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional(),
  }),
});

export const InvestmentValidation = {
  create,
  update,
};
