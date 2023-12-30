import { z } from 'zod';
import { billStatus } from './bill.constant';

const create = z.object({
  body: z.object({
    data: z.object({
      date: z.string({ required_error: 'Date is Required' }),
      vendorId: z.string({ required_error: 'Vendor ID is Required' }),
      totalQty: z.number({ required_error: 'Total Quantity is Required' }),
      totalPrice: z.number({ required_error: 'Total Price is Required' }),
      discount: z.number().optional().default(0),
      amount: z.number({ required_error: 'Amount is required' }),
      paidAmount: z.number().optional().default(0),
      refNo: z.string().optional(),
      status: z.enum(billStatus as [string, ...string[]]).optional(),
    }),
    billEquipments: z.array(
      z.object({
        equipmentId: z.string({ required_error: 'Equipment ID is required' }),
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
      vendorId: z.string().optional(),
      totalQty: z.number().optional(),
      totalPrice: z.number().optional(),
      discount: z.number().optional(),
      amount: z.number().optional(),
      paidAmount: z.number().optional(),
      refNo: z.string().optional(),
      userId: z.string().optional(),
      status: z.enum(billStatus as [string, ...string[]]).optional(),
    }),
    billEquipments: z
      .array(
        z.object({
          equipmentId: z.string().optional(),
          quantity: z.number().optional(),
          unitPrice: z.number().optional(),
          totalPrice: z.number().optional(),
        })
      )
      .optional(),
  }),
});

export const BillValidation = {
  create,
  update,
};
