import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { MeterService } from './meter.service';
import { Meter } from '@prisma/client';
import { meterFilterableFields } from './meter.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await MeterService.insertIntoDB(data);

  sendResponse<Meter>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meter Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, meterFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await MeterService.getAll(filters, paginationOptions);

  sendResponse<Meter[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meters retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MeterService.getSingle(id);

  sendResponse<Meter>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meter retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await MeterService.updateSingle(id, data);

  sendResponse<Meter>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Meter Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MeterService.deleteFromDB(id);

  sendResponse<Meter>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Meter Deleted successfully',
    data: result,
  });
});

export const MeterController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
