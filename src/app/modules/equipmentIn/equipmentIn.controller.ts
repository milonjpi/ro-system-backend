import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { EquipmentInService } from './equipmentIn.service';
import { EquipmentIn } from '@prisma/client';
import { equipmentInFilterableFields } from './equipmentIn.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await EquipmentInService.insertIntoDB(data);

  sendResponse<EquipmentIn>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Equipment In Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, equipmentInFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await EquipmentInService.getAll(filters, paginationOptions);

  sendResponse<EquipmentIn[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EquipmentInService.getSingle(id);

  sendResponse<EquipmentIn>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EquipmentInService.updateSingle(id, data);

  sendResponse<EquipmentIn>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Equipment Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EquipmentInService.deleteFromDB(id);

  sendResponse<EquipmentIn>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment Deleted successfully',
    data: result,
  });
});

export const EquipmentInController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
