import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Expense Head is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Expense Head is Required' }),
  }),
});

export const BuildingExpenseHeadValidation = {
  create,
  update,
};
