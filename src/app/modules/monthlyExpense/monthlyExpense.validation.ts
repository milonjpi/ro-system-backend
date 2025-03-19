import { z } from 'zod';

const create = z.object({
  body: z.object({
    data: z
      .object({
        year: z.string({ required_error: 'Year is Required' }),
        month: z.string({ required_error: 'Month is Required' }),
        date: z.string({ required_error: 'Date is Required' }),
        expenseAreaId: z.string({
          required_error: 'Expense Area ID is Required',
        }),
        vehicleId: z.string().optional().nullable(),
        monthlyExpenseHeadId: z.string({
          required_error: 'Expense Head ID is Required',
        }),
        expenseDetails: z.string().optional().nullable(),
        amount: z.number({ required_error: 'Amount is Required' }),
        paymentSourceId: z.string({
          required_error: 'Payment Source ID is Required',
        }),
      })
      .array(),
  }),
});

const update = z.object({
  body: z.object({
    year: z.string().optional(),
    month: z.string().optional(),
    date: z.string().optional(),
    expenseAreaId: z.string().optional(),
    vehicleId: z.string().optional().nullable(),
    monthlyExpenseHeadId: z.string().optional(),
    expenseDetails: z.string().optional().nullable(),
    amount: z.number().optional(),
    paymentSourceId: z.string().optional(),
  }),
});

export const MonthlyExpenseValidation = {
  create,
  update,
};
