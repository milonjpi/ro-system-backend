import { z } from 'zod';
import { invoiceStatus } from '../invoice/invoice.constant';

const receivePayment = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    amount: z.number({ required_error: 'Account is Required' }),
    customerId: z.string({ required_error: 'Customer ID is Required' }),
    accountHeadId: z.string({ required_error: 'Account Head ID is Required' }),
    narration: z.string().optional(),
    invoices: z
      .array(
        z.object({
          id: z.string({ required_error: 'Invoice ID is required' }),
          paidAmount: z.string({ required_error: 'Paid Amount is required' }),
          status: z.enum(invoiceStatus as [string, ...string[]], {
            required_error: 'Invoice Status is required',
          }),
        })
      )
      .optional()
      .default([]),
  }),
});

export const VoucherValidation = {
  receivePayment,
};
