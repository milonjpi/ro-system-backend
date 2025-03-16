import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { PaymentSourceService } from './paymentSource.service';
import { PaymentSource } from '@prisma/client';
import { paymentSourceFilterableFields } from './paymentSource.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await PaymentSourceService.insertIntoDB(data);

  sendResponse<PaymentSource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Source Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentSourceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await PaymentSourceService.getAll(filters, paginationOptions);

  sendResponse<PaymentSource[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Sources retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await PaymentSourceService.getSingle(id);

  sendResponse<PaymentSource>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Source retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await PaymentSourceService.updateSingle(id, data);

  sendResponse<PaymentSource>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Source Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await PaymentSourceService.deleteFromDB(id);

  sendResponse<PaymentSource>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Source Deleted successfully',
    data: result,
  });
});

export const PaymentSourceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
