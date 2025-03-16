import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { VehicleService } from './vehicle.service';
import { Vehicle } from '@prisma/client';
import { vehicleFilterableFields } from './vehicle.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await VehicleService.insertIntoDB(data);

  sendResponse<Vehicle>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vehicle Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, vehicleFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await VehicleService.getAll(filters, paginationOptions);

  sendResponse<Vehicle[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicles retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await VehicleService.getSingle(id);

  sendResponse<Vehicle>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await VehicleService.updateSingle(id, data);

  sendResponse<Vehicle>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Vehicle Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await VehicleService.deleteFromDB(id);

  sendResponse<Vehicle>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vehicle Deleted successfully',
    data: result,
  });
});

export const VehicleController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
