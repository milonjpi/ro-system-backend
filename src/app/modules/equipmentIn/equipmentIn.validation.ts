import { z } from 'zod';

const create = z.object({
  body: z.object({
    equipmentId: z.string({ required_error: 'Equipment ID is Required' }),
    date: z.string({ required_error: 'Date is required' }),
    accountHeadId: z.string({ required_error: 'Account Head is required' }),
    quantity: z.number({ required_error: 'Quantity is required' }),
    unitPrice: z.number({ required_error: 'Unit Price is required' }),
    totalPrice: z.number({ required_error: 'Total Price is required' }),
    usedQty: z.number().optional().default(0),
    vendorId: z.string().optional(),
    billId: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

const update = z.object({
  body: z.object({
    equipmentId: z.string().optional(),
    date: z.string().optional(),
    accountHeadId: z.string().optional(),
    quantity: z.number().optional(),
    unitPrice: z.number().optional(),
    totalPrice: z.number().optional(),
    usedQty: z.number().optional(),
    vendorId: z.string().optional(),
    billId: z.string().optional(),
    remarks: z.string().optional(),
  }),
});

export const EquipmentInValidation = {
  create,
  update,
};
