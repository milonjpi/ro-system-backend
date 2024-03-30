import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Category is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Category is Required' }),
  }),
});

export const IncomeExpenseCategoryValidation = {
  create,
  update,
};
