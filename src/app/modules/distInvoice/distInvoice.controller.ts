import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { DistInvoiceService } from './distInvoice.service';
import { DistInvoice, UserRole } from '@prisma/client';
import { distInvoiceFilterableFields } from './distInvoice.constant';
import { IDistInvoiceResponse } from './distInvoice.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const user = req.user as { id: string; role: UserRole };

  data.data.userId = user.id;

  const result = await DistInvoiceService.insertIntoDB(
    data?.data,
    data?.distInvoicedProducts
  );

  sendResponse<DistInvoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distInvoiceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DistInvoiceService.getAll(filters, paginationOptions);

  sendResponse<IDistInvoiceResponse>(res, {
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

  const result = await DistInvoiceService.getSingle(id);

  sendResponse<DistInvoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoices retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await DistInvoiceService.updateSingle(
    id,
    data?.data,
    data?.distInvoicedProducts
  );

  sendResponse<DistInvoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DistInvoiceService.deleteFromDB(id);

  sendResponse<DistInvoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice Deleted successfully',
    data: result,
  });
});

export const DistInvoiceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
