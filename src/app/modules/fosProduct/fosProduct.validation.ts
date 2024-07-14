import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Product Name is Required' }),
    description: z.string().optional(),
    uom: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    uom: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const FosProductValidation = {
  create,
  update,
};
