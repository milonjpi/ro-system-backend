import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Group (EN) is Required' }),
    labelBn: z.string({ required_error: 'Group (BN) is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    labelBn: z.string().optional(),
  }),
});

export const RecipientGroupValidation = {
  create,
  update,
};
