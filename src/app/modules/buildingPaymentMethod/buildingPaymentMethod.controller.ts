import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingPaymentMethodService } from './buildingPaymentMethod.service';
import { BuildingPaymentMethod } from '@prisma/client';
import { buildingPaymentMethodFilterableFields } from './buildingPaymentMethod.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingPaymentMethodService.insertIntoDB(data);

  sendResponse<BuildingPaymentMethod>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Method Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingPaymentMethodFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingPaymentMethodService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<BuildingPaymentMethod[]>(res, {
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

  const result = await BuildingPaymentMethodService.getSingle(id);

  sendResponse<BuildingPaymentMethod>(res, {
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

  const result = await BuildingPaymentMethodService.updateSingle(id, data);

  sendResponse<BuildingPaymentMethod>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Method Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingPaymentMethodService.deleteFromDB(id);

  sendResponse<BuildingPaymentMethod>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment Method Deleted successfully',
    data: result,
  });
});

export const BuildingPaymentMethodController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
