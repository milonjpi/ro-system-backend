import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Expense Head is Required' }),
    description: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const MonthlyExpenseHeadValidation = {
  create,
  update,
};
