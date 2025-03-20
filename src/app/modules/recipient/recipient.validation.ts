import { z } from 'zod';

const create = z.object({
  body: z.object({
    fullName: z.string({ required_error: 'Full Name is Required' }),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    fullName: z.string().optional(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

export const RecipientValidation = {
  create,
  update,
};
