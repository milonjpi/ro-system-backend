import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    assetId: z.string({ required_error: 'Asset ID is Required' }),
    quantity: z.number({ required_error: 'Quantity is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    remarks: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    assetId: z.string().optional(),
    quantity: z.number().optional(),
    amount: z.number().optional(),
    remarks: z.string().optional(),
  }),
});

export const FixedAssetValidation = {
  create,
  update,
};
