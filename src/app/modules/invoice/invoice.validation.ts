import { z } from 'zod';
import { invoiceStatus } from './invoice.constant';

const create = z.object({
  body: z.object({
    data: z.object({
      date: z.string({ required_error: 'Date is Required' }),
      customerId: z.string({ required_error: 'Customer ID is Required' }),
      totalQty: z.number({ required_error: 'Total Quantity is Required' }),
      totalPrice: z.number({ required_error: 'Total Price is Required' }),
      discount: z.number().optional().default(0),
      amount: z.number({ required_error: 'Amount is Required' }),
      paidAmount: z.number().optional().default(0),
      orderId: z.string().optional(),
      status: z.enum(invoiceStatus as [string, ...string[]]).optional(),
    }),
    invoicedProducts: z.array(
      z.object({
        productId: z.string({ required_error: 'Product ID is required' }),
        quantity: z.number({ required_error: 'Quantity is required' }),
        unitPrice: z.number({ required_error: 'Unit Price is required' }),
        totalPrice: z.number({ required_error: 'Total Price is required' }),
      }),
      { required_error: 'Products is required' }
    ),
    voucher: z
      .object({
        amount: z.number().optional(),
      })
      .optional(),
  }),
});

const update = z.object({
  body: z.object({
    data: z.object({
      date: z.string().optional(),
      customerId: z.string().optional(),
      totalQty: z.number().optional(),
      totalPrice: z.number().optional(),
      discount: z.number().optional(),
      amount: z.number().optional(),
      paidAmount: z.number().optional(),
      orderId: z.string().optional(),
      userId: z.string().optional(),
      status: z.enum(invoiceStatus as [string, ...string[]]).optional(),
    }),
    invoicedProducts: z
      .array(
        z.object({
          productId: z.string().optional(),
          quantity: z.number().optional(),
          unitPrice: z.number().optional(),
          totalPrice: z.number().optional(),
        })
      )
      .optional(),
    voucher: z
      .object({
        amount: z.number().optional(),
      })
      .optional(),
  }),
});

export const InvoiceValidation = {
  create,
  update,
};
