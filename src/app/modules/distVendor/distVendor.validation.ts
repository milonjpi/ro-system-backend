import { z } from 'zod';

const create = z.object({
  body: z.object({
    vendorName: z.string({ required_error: 'Vendor Name is Required' }),
    vendorNameBn: z.string().optional(),
    mobile: z.string().optional(),
    address: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    vendorName: z.string().optional(),
    vendorNameBn: z.string().optional(),
    mobile: z.string().optional(),
    address: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const DistVendorValidation = {
  create,
  update,
};
