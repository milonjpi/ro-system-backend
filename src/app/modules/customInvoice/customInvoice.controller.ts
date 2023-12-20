import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { Customer } from '@prisma/client';
import { customInvoiceFilterableFields } from './customInvoice.constant';
import { CustomInvoiceService } from './customInvoice.service';

// get custom invoices
const getCustomInvoices = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, customInvoiceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await CustomInvoiceService.getCustomInvoices(
    filters,
    paginationOptions
  );

  sendResponse<Customer[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Custom Invoices retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const CustomInvoiceController = {
  getCustomInvoices,
};
