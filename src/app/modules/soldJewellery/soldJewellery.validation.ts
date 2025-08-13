import { z } from 'zod';
import { soldTypes } from './soldJewellery.constant';

const create = z.object({
  body: z.object({
    soldType: z.enum(soldTypes as [string, ...string[]], {
      required_error: 'Type is Required',
    }),
    jewelleryId: z.string({ required_error: 'Jewellery ID is Required' }),
    soldDate: z.string({ required_error: 'Sold Date is Required' }),
    year: z.string({ required_error: 'Sold Date is Required' }),
    month: z.string({ required_error: 'Sold Date is Required' }),
    percent: z.string({ required_error: 'Sold Date is Required' }),
    weight: z.number({ required_error: 'Weight is Required' }),
    unitPrice: z.number().optional(),
    totalPrice: z.number().optional(),
    deduction: z.number().optional(),
    price: z.number({ required_error: 'Price is Required' }),
    remarks: z.string().optional().nullable(),
  }),
});

const update = z.object({
  body: z.object({
    soldType: z.enum(soldTypes as [string, ...string[]]).optional(),
    jewelleryId: z.string().optional(),
    soldDate: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
    percent: z.string().optional(),
    weight: z.number().optional(),
    unitPrice: z.number().optional(),
    totalPrice: z.number().optional(),
    deduction: z.number().optional(),
    price: z.number().optional(),
    remarks: z.string().optional().nullable(),
  }),
});

export const SoldJewelleryValidation = {
  create,
  update,
};
