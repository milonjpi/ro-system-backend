import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Expense Type is Required' }),
    description: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
  }),
});

export const ExpenseTypeValidation = {
  create,
  update,
};
