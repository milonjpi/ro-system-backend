import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Meter Info is Required' }),
    location: z.string().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    location: z.string().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const MeterValidation = {
  create,
  update,
};
