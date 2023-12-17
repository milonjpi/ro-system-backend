import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { EquipmentService } from './equipment.service';
import { Equipment } from '@prisma/client';
import { equipmentFilterableFields } from './equipment.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await EquipmentService.insertIntoDB(data);

  sendResponse<Equipment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Equipment Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, equipmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await EquipmentService.getAll(filters, paginationOptions);

  sendResponse<Equipment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EquipmentService.getSingle(id);

  sendResponse<Equipment>(res, {
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

  const result = await EquipmentService.updateSingle(id, data);

  sendResponse<Equipment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Equipment Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await EquipmentService.deleteFromDB(id);

  sendResponse<Equipment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Equipment Deleted successfully',
    data: result,
  });
});

export const EquipmentController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
