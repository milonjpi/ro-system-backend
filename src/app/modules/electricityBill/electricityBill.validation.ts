import { z } from 'zod';
import { electricityBillStatus } from './electricityBill.constant';

const create = z.object({
  body: z.object({
    date: z.string().optional().nullable(),
    meterId: z.string({ required_error: 'Meter ID is Required' }),
    month: z.string({ required_error: 'Month is Required' }),
    year: z.string({ required_error: 'Year is Required' }),
    meterReading: z.number().optional(),
    unit: z.number().optional(),
    unitDetails: z.string().optional(),
    netBill: z.number().optional(),
    serviceCharge: z.number().optional(),
    amount: z.number({ required_error: 'Amount is Required' }),
    paidBy: z.string({ required_error: 'Paid By is Required' }),
    remarks: z.string().optional(),
    status: z.enum(electricityBillStatus as [string, ...string[]]).optional(),
  }),
});

const update = z.object({
  body: z.object({
    date: z.string().optional().nullable(),
    meterId: z.string().optional(),
    month: z.string().optional(),
    year: z.string().optional(),
    meterReading: z.number().optional().nullable(),
    unit: z.number().optional().nullable(),
    unitDetails: z.string().optional().nullable(),
    netBill: z.number().optional().nullable(),
    serviceCharge: z.number().optional().nullable(),
    amount: z.number().optional(),
    paidBy: z.string().optional(),
    remarks: z.string().optional().nullable(),
    status: z.enum(electricityBillStatus as [string, ...string[]]).optional(),
  }),
});

export const ElectricityBillValidation = {
  create,
  update,
};
