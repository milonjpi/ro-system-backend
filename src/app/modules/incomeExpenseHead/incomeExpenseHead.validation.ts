import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Head is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Head is Required' }),
  }),
});

export const IncomeExpenseHeadValidation = {
  create,
  update,
};
