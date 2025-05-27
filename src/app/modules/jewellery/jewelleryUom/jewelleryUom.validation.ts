import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Uom is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Uom is Required' }),
  }),
});

export const JewelleryUomValidation = {
  create,
  update,
};
