import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { InvoiceService } from './invoice.service';
import { Invoice, UserRole } from '@prisma/client';
import { invoiceFilterableFields } from './invoice.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const user = req.user as { id: string; role: UserRole };

  data.data.userId = user.id;

  const result = await InvoiceService.insertIntoDB(
    data?.data,
    data?.invoicedProducts
  );

  sendResponse<Invoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, invoiceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await InvoiceService.getAll(filters, paginationOptions);

  sendResponse<Invoice[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoices retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await InvoiceService.getSingle(id);

  sendResponse<Invoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await InvoiceService.updateSingle(
    id,
    data?.data,
    data?.invoicedProducts
  );

  sendResponse<Invoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await InvoiceService.deleteFromDB(id);

  sendResponse<Invoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice Deleted successfully',
    data: result,
  });
});

// cancel
const cancelInvoice = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await InvoiceService.cancelInvoice(id);

  sendResponse<Invoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice Canceled successfully',
    data: result,
  });
});

export const InvoiceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  cancelInvoice,
};
