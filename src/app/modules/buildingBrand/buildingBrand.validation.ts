import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Brand is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Brand is Required' }),
  }),
});

export const BuildingBrandValidation = {
  create,
  update,
};
