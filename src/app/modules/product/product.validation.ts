import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Label is Required' }),
    description: z.string().optional(),
    uom: z.string({ required_error: 'UOM is required' }),
    price: z.number({ required_error: 'Price is required' }),
    isActive: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    description: z.string().optional(),
    uom: z.string().optional(),
    price: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const ProductValidation = {
  create,
  update,
};
