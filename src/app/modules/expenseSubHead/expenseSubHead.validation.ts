import { z } from 'zod';

const create = z.object({
  body: z.object({
    expenseHeadId: z.string({ required_error: 'Expense Head ID is Required' }),
    label: z.string({ required_error: 'Sub Head is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    expenseHeadId: z.string().optional(),
    label: z.string().optional(),
  }),
});

export const ExpenseSubHeadValidation = {
  create,
  update,
};
