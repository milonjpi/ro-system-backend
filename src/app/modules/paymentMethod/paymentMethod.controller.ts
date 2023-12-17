import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { PaymentMethodService } from './paymentMethod.service';
import { PaymentMethod } from '@prisma/client';
import { paymentMethodFilterableFields } from './paymentMethod.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await PaymentMethodService.insertIntoDB(data);

  sendResponse<PaymentMethod>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Method Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentMethodFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await PaymentMethodService.getAll(filters, paginationOptions);

  sendResponse<PaymentMethod[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Methods retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await PaymentMethodService.getSingle(id);

  sendResponse<PaymentMethod>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Method retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await PaymentMethodService.updateSingle(id, data);

  sendResponse<PaymentMethod>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Method Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await PaymentMethodService.deleteFromDB(id);

  sendResponse<PaymentMethod>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Method Deleted successfully',
    data: result,
  });
});

export const PaymentMethodController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
