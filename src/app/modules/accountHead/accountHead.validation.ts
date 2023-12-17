import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Label is Required' }),
    accountTypeId: z.string({ required_error: 'Account Type ID is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    accountTypeId: z.string().optional(),
  }),
});

export const AccountHeadValidation = {
  create,
  update,
};
