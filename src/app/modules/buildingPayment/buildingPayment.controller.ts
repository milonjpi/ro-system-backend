import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingPaymentService } from './buildingPayment.service';
import { BuildingPayment } from '@prisma/client';
import { buildingPaymentFilterableFields } from './buildingPayment.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingPaymentService.insertIntoDB(data);

  sendResponse<BuildingPayment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingPaymentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingPaymentService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<BuildingPayment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingPaymentService.getSingle(id);

  sendResponse<BuildingPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BuildingPaymentService.updateSingle(id, data);

  sendResponse<BuildingPayment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingPaymentService.deleteFromDB(id);

  sendResponse<BuildingPayment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Deleted successfully',
    data: result,
  });
});

export const BuildingPaymentController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
