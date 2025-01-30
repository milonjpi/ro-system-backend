import { z } from 'zod';
import { invoiceStatus } from '../invoice/invoice.constant';

const receivePayment = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    amount: z.number({ required_error: 'Account is Required' }),
    customerId: z.string({ required_error: 'Customer ID is Required' }),
    narration: z.string().optional(),
  }),
});

const makePayment = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    amount: z.number({ required_error: 'Account is Required' }),
    vendorId: z.string({ required_error: 'Vendor ID is Required' }),
    narration: z.string().optional(),
    bills: z
      .array(
        z.object({
          id: z.string({ required_error: 'Bill ID is required' }),
          paidAmount: z.number({ required_error: 'Paid Amount is required' }),
          status: z.enum(invoiceStatus as [string, ...string[]], {
            required_error: 'Bill Status is required',
          }),
        })
      )
      .optional()
      .default([]),
    voucherDetails: z
      .array(
        z.object({
          billId: z.string({ required_error: 'Bill ID is required' }),
          receiveAmount: z.number({
            required_error: 'Receive Amount is required',
          }),
        })
      )
      .optional()
      .default([]),
  }),
});

export const VoucherValidation = {
  receivePayment,
  makePayment,
};
