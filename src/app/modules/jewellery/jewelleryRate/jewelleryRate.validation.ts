import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    caratId: z.string({ required_error: 'KDM Id is Required' }),
    price: z.number({ required_error: 'Price is Required' }),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    caratId: z.string().optional(),
    price: z.number().optional(),
  }),
});

export const JewelleryRateValidation = {
  create,
  update,
};
