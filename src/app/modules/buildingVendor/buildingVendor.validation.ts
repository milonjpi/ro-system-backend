import { z } from 'zod';

const create = z.object({
  body: z.object({
    label: z.string({ required_error: 'Vendor is Required' }),
    contactNo: z.string().optional(),
    address: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    label: z.string({ required_error: 'Vendor is Required' }),
    contactNo: z.string().optional(),
    address: z.string().optional(),
  }),
});

export const BuildingVendorValidation = {
  create,
  update,
};
