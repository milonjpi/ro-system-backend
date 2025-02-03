import { z } from 'zod';

const create = z.object({
  body: z.object({
    date: z.string({ required_error: 'Date is Required' }),
    expenseHeadId: z.string({
      required_error: 'Expense Head ID is Required',
    }),
    vendorId: z.string({
      required_error: 'Vendor ID is Required',
    }),
    brandId: z.string().optional().nullable(),
    uomId: z.string({
      required_error: 'UOM ID is Required',
    }),
    quantity: z.number({ required_error: 'Quantity is Required' }),
    unitPrice: z.number({ required_error: 'Unit Price is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    paidAmount: z.number().optional(),
    remarks: z.string().optional().nullable(),
    buildingPayments: z
      .array(
        z.object({
          date: z.string({ required_error: 'Date is Required' }),
          paymentMethodId: z.string({
            required_error: 'Payment Method ID is Required',
          }),
          amount: z.number({ required_error: 'Payment Amount is Required' }),
        }),
        { required_error: 'Payments are Required' }
      )
      .default([])
      .refine(
        payments =>
          payments.length === 0 ||
          payments.every(payment => payment.amount > 0),
        {
          message: 'All payment amounts must be greater than zero if provided',
        }
      ),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional(),
    expenseHeadId: z.string().optional(),
    vendorId: z.string().optional(),
    brandId: z.string().optional().nullable(),
    uomId: z.string().optional(),
    quantity: z.number().optional(),
    unitPrice: z.number().optional(),
    amount: z.number().optional(),
    paidAmount: z.number().optional(),
    remarks: z.string().optional().nullable(),
    buildingPayments: z
      .array(
        z.object({
          date: z.string({ required_error: 'Date is Required' }),
          paymentMethodId: z.string({
            required_error: 'Payment Method ID is Required',
          }),
          amount: z.number({ required_error: 'Payment Amount is Required' }),
        }),
        { required_error: 'Payments are Required' }
      )
      .default([])
      .refine(
        payments =>
          payments.length === 0 ||
          payments.every(payment => payment.amount > 0),
        {
          message: 'All payment amounts must be greater than zero if provided',
        }
      ),
  }),
});

export const BuildingExpenseValidation = {
  create,
  update,
};
