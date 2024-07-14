import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    fosCustomerId: z.string({ required_error: 'Customer ID is Required' }),
    totalQty: z.number({ required_error: 'Total Quantity is Required' }),
    invoicedProducts: z.array(
      z.object({
        fosProductId: z.string({ required_error: 'Product ID is required' }),
        quantity: z.number({ required_error: 'Quantity is required' }),
      }),
      { required_error: 'Products is required' }
    ),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    fosCustomerId: z.string().optional(),
    totalQty: z.number().optional(),
    invoicedProducts: z.array(
      z.object({
        fosProductId: z.string().optional(),
        quantity: z.number().optional(),
      }),
      { required_error: 'Products is required' }
    ),
  }),
});

export const FosInvoiceValidation = {
  create,
  update,
};
