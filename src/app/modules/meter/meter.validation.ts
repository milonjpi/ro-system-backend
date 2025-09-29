import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Meter Info is Required' }),
    location: z.string().optional(),
    smsAccount: z.string().optional(),
    customerName: z.string().optional(),
    remarks: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    location: z.string().optional(),
    smsAccount: z.string().optional(),
    customerName: z.string().optional(),
    remarks: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
  }),
});

export const MeterValidation = {
  create,
  update,
};