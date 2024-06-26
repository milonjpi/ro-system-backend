import { z } from 'zod';

const create = z.object({
  body: z.object({
    customerName: z.string({ required_error: 'Customer Name is Required' }),
    customerNameBn: z.string().optional(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    groupId: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    isDistributor: z.boolean().optional(),
  }),
});

const update = z.object({
  body: z.object({
    customerName: z.string().optional(),
    customerNameBn: z.string().optional(),
    mobile: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    groupId: z.string().optional().nullable(),
    isActive: z.boolean().optional(),
    isDistributor: z.boolean().optional(),
  }),
});

export const CustomerValidation = {
  create,
  update,
};
