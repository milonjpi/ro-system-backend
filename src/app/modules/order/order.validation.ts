import { z } from 'zod';
import { orderStatus } from './order.constant';

const create = z.object({
  body: z.object({
    data: z.object({
      date: z.string({ required_error: 'Date is Required' }),
      deliveryDate: z.string({ required_error: 'Delivery Date is Required' }),
      totalQty: z.number({ required_error: 'Total Quantity is Required' }),
      totalPrice: z.number({ required_error: 'Total Price is Required' }),
      customerId: z.string({ required_error: 'Customer ID is Required' }),
      status: z.enum(orderStatus as [string, ...string[]]).optional(),
    }),
    orderedProducts: z.array(
      z.object({
        productId: z.string({ required_error: 'Product ID is required' }),
        quantity: z.number({ required_error: 'Quantity is required' }),
        unitPrice: z.number({ required_error: 'Unit Price is required' }),
        totalPrice: z.number({ required_error: 'Total Price is required' }),
      }),
      { required_error: 'Products is required' }
    ),
  }),
});

const update = z.object({
  body: z.object({
    data: z.object({
      date: z.string().optional(),
      deliveryDate: z.string().optional(),
      totalQty: z.number().optional(),
      totalPrice: z.number().optional(),
      customerId: z.string().optional(),
      status: z.enum(orderStatus as [string, ...string[]]).optional(),
    }),
    orderedProducts: z
      .array(
        z.object({
          productId: z.string().optional(),
          quantity: z.number().optional(),
          unitPrice: z.number().optional(),
          totalPrice: z.number().optional(),
        })
      )
      .optional(),
  }),
});

export const OrderValidation = {
  create,
  update,
};
