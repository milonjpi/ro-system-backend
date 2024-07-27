import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ElectricityBillService } from './electricityBill.service';
import { ElectricityBill } from '@prisma/client';
import { electricityBillFilterableFields } from './electricityBill.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ElectricityBillService.insertIntoDB(data);

  sendResponse<ElectricityBill>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Electricity Bill Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, electricityBillFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ElectricityBillService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<ElectricityBill[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Electricity Bills retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ElectricityBillService.getSingle(id);

  sendResponse<ElectricityBill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Electricity Bill retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ElectricityBillService.updateSingle(id, data);

  sendResponse<ElectricityBill>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Electricity Bill Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ElectricityBillService.deleteFromDB(id);

  sendResponse<ElectricityBill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Electricity Bill Deleted successfully',
    data: result,
  });
});

export const ElectricityBillController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
