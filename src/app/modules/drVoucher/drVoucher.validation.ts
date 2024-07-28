import { z } from 'zod';
import { drInvoiceStatus } from '../drInvoice/drInvoice.constant';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    amount: z.number({ required_error: 'Account is Required' }),
    customerId: z.string({ required_error: 'Customer ID is Required' }),
    narration: z.string().optional(),
    invoices: z
      .array(
        z.object({
          id: z.string({ required_error: 'Invoice ID is required' }),
          paidAmount: z.number({ required_error: 'Paid Amount is required' }),
          status: z.enum(drInvoiceStatus as [string, ...string[]], {
            required_error: 'Invoice Status is required',
          }),
        })
      )
      .optional()
      .default([]),
    drVoucherDetails: z
      .array(
        z.object({
          invoiceId: z.string({ required_error: 'Invoice ID is required' }),
          receiveAmount: z.number({
            required_error: 'Receive Amount is required',
          }),
        })
      )
      .optional()
      .default([]),
  }),
});

export const DrVoucherValidation = {
  create,
};
