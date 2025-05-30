import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingExpenseHeadService } from './buildingExpenseHead.service';
import { BuildingExpenseHead } from '@prisma/client';
import { buildingExpenseHeadFilterableFields } from './buildingExpenseHead.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BuildingExpenseHeadService.insertIntoDB(data);

  sendResponse<BuildingExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingExpenseHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingExpenseHeadService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<BuildingExpenseHead[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Heads retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingExpenseHeadService.getSingle(id);

  sendResponse<BuildingExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Head retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BuildingExpenseHeadService.updateSingle(id, data);

  sendResponse<BuildingExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingExpenseHeadService.deleteFromDB(id);

  sendResponse<BuildingExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Head Deleted successfully',
    data: result,
  });
});

export const BuildingExpenseHeadController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
