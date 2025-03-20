import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Vehicle Reg. No is Required' }),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    description: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const VehicleValidation = {
  create,
  update,
};
