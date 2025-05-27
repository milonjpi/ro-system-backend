import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Vendor is Required' }),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string().optional(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
  }),
});

export const JewelleryVendorValidation = {
  create,
  update,
};
