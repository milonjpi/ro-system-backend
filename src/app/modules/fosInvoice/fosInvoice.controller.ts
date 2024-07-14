import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { FosInvoiceService } from './fosInvoice.service';
import { FosInvoice, UserRole } from '@prisma/client';
import { fosInvoiceFilterableFields } from './fosInvoice.constant';
import { IFosInvoiceResponse } from './fosInvoice.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { fosInvoicedProducts, ...data } = req.body;

  const user = req.user as { id: string; role: UserRole };

  data.userId = user.id;

  const result = await FosInvoiceService.insertIntoDB(
    data,
    fosInvoicedProducts
  );

  sendResponse<FosInvoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fosInvoiceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await FosInvoiceService.getAll(filters, paginationOptions);

  sendResponse<IFosInvoiceResponse>(res, {
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

  const result = await FosInvoiceService.getSingle(id);

  sendResponse<FosInvoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { fosInvoicedProducts, ...data } = req.body;

  const result = await FosInvoiceService.updateSingle(
    id,
    data,
    fosInvoicedProducts
  );

  sendResponse<FosInvoice>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Invoice Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FosInvoiceService.deleteFromDB(id);

  sendResponse<FosInvoice>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Invoice Deleted successfully',
    data: result,
  });
});

export const FosInvoiceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
