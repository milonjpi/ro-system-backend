import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Label is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Label is Required' }),
  }),
});

export const ExpenseHeadValidation = {
  create,
  update,
};
