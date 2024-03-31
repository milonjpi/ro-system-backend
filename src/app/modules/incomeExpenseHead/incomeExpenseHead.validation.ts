import { z } from 'zod';

const create = z.object({
  body: z.object({
    type: z.enum(['Income', 'Expense'], { required_error: 'Type is Required' }),
    categoryId: z.string({ required_error: 'Category ID is Required' }),
    label: z.string({ required_error: 'Head is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    type: z.enum(['Income', 'Expense']).optional(),
    categoryId: z.string().optional(),
    label: z.string().optional(),
  }),
});

export const IncomeExpenseHeadValidation = {
  create,
  update,
};
