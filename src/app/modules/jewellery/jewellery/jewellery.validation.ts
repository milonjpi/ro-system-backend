import { z } from 'zod';

const create = z.object({
  body: z.object({
    data: z
      .object({
        jewelleryTypeId: z.string({
          required_error: 'Jewellery Type ID is Required',
        }),
        caratId: z.string({
          required_error: 'Carat ID is Required',
        }),
        vendorId: z.string({
          required_error: 'Vendor ID is Required',
        }),
        invoiceNo: z.string({
          required_error: 'Invoice No is Required',
        }),
        dop: z.string({
          required_error: 'Purchase Date is Required',
        }),
        year: z.string({
          required_error: 'Year is Required',
        }),
        month: z.string({
          required_error: 'Month is Required',
        }),
        uomId: z.string().optional().nullable(),
        unitPrice: z.number().optional(),
        weight: z.number({
          required_error: 'Weight is Required',
        }),
        price: z.number({
          required_error: 'Price is Required',
        }),
        remarks: z.string().optional().nullable(),
        isSold: z.boolean().optional(),
        isExchanged: z.boolean().optional(),
        soldDate: z.string().optional().nullable(),
      })
      .array(),
  }),
});

const update = z.object({
  body: z.object({
    jewelleryTypeId: z.string().optional(),
    caratId: z.string().optional(),
    vendorId: z.string().optional(),
    invoiceNo: z.string().optional(),
    dop: z.string().optional(),
    year: z.string().optional(),
    month: z.string().optional(),
    uomId: z.string().optional().nullable(),
    unitPrice: z.number().optional(),
    weight: z.number().optional(),
    price: z.number().optional(),
    remarks: z.string().optional().nullable(),
    isSold: z.boolean().optional(),
    isExchanged: z.boolean().optional(),
    soldDate: z.string().optional().nullable(),
  }),
});

export const JewelleryValidation = {
  create,
  update,
};
