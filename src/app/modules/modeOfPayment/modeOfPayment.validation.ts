import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Mode of Payment is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Mode of Payment is Required' }),
  }),
});

export const ModeOfPaymentValidation = {
  create,
  update,
};
