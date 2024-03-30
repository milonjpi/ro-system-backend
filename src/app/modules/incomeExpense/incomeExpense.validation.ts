import { z } from 'zod';

const create = z.object({
  body: z.object({
    type: z.enum(['Income', 'Expense'], { required_error: 'Type is Required' }),
    date: z.string({ required_error: 'Date is Required' }),
    categoryId: z.string({ required_error: 'Category ID is Required' }),
    incomeExpenseHeadId: z.string({ required_error: 'Head ID is Required' }),
    amount: z.number({ required_error: 'Amount is Required' }),
    modeOfPaymentId: z.string({
      required_error: 'Mode of Payment is Required',
    }),
    remarks: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    type: z.enum(['Income', 'Expense']).optional(),
    date: z.string().optional(),
    categoryId: z.string().optional(),
    incomeExpenseHeadId: z.string().optional(),
    amount: z.number().optional(),
    modeOfPaymentId: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

export const IncomeExpenseValidation = {
  create,
  update,
};
