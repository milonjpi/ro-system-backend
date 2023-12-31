import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Label is Required' }),
    uom: z.string({ required_error: 'Uom is Required' }),
    isAsset: z.boolean({ required_error: 'Is Asset is required' }),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    uom: z.string().optional(),
    isAsset: z.boolean().optional(),
  }),
});

export const EquipmentValidation = {
  create,
  update,
};
