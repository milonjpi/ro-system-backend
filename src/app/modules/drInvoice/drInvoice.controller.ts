import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { DrInvoiceService } from './drInvoice.service';
import { DrInvoice, UserRole } from '@prisma/client';
import { drInvoiceFilterableFields } from './drInvoice.constant';
import { IDrInvoiceResponse } from './drInvoice.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { drInvoicedProducts, ...data } = req.body;

  const user = req.user as { id: string; role: UserRole };

  data.userId = user.id;

  const result = await DrInvoiceService.insertIntoDB(data, drInvoicedProducts);

  sendResponse<DrInvoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, drInvoiceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DrInvoiceService.getAll(filters, paginationOptions);

  sendResponse<IDrInvoiceResponse>(res, {
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

  const result = await DrInvoiceService.getSingle(id);

  sendResponse<DrInvoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { drInvoicedProducts, ...data } = req.body;

  const result = await DrInvoiceService.updateSingle(
    id,
    data,
    drInvoicedProducts
  );

  sendResponse<DrInvoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await DrInvoiceService.deleteFromDB(id);

  sendResponse<DrInvoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice Deleted successfully',
    data: result,
  });
});

export const DrInvoiceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
