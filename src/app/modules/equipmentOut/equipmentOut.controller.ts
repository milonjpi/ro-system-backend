import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { EquipmentOutService } from './equipmentOut.service';
import { EquipmentOut } from '@prisma/client';
import { equipmentOutFilterableFields } from './equipmentOut.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await EquipmentOutService.insertIntoDB(data);

  sendResponse<EquipmentOut>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Equipment Out Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, equipmentOutFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await EquipmentOutService.getAll(filters, paginationOptions);

  sendResponse<EquipmentOut[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment out retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EquipmentOutService.getSingle(id);

  sendResponse<EquipmentOut>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment out retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await EquipmentOutService.updateSingle(id, data);

  sendResponse<EquipmentOut>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Equipment Out Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EquipmentOutService.deleteFromDB(id);

  sendResponse<EquipmentOut>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment Out Deleted successfully',
    data: result,
  });
});

export const EquipmentOutController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
