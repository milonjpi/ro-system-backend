import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Carat is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Carat is Required' }),
  }),
});

export const CaratValidation = {
  create,
  update,
};
