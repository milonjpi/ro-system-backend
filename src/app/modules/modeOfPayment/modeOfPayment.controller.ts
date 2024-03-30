import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ModeOfPaymentService } from './modeOfPayment.service';
import { ModeOfPayment } from '@prisma/client';
import { modeOfPaymentFilterableFields } from './modeOfPayment.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ModeOfPaymentService.insertIntoDB(data);

  sendResponse<ModeOfPayment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Mode Of Payment Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, modeOfPaymentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ModeOfPaymentService.getAll(filters, paginationOptions);

  sendResponse<ModeOfPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mode Of Payments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ModeOfPaymentService.getSingle(id);

  sendResponse<ModeOfPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mode Of Payment retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ModeOfPaymentService.updateSingle(id, data);

  sendResponse<ModeOfPayment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Mode Of Payment Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ModeOfPaymentService.deleteFromDB(id);

  sendResponse<ModeOfPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Mode Of Payment Deleted successfully',
    data: result,
  });
});

export const ModeOfPaymentController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
