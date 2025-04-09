import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Expense Detail is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Expense Detail is Required' }),
  }),
});

export const ExpenseDetailValidation = {
  create,
  update,
};
