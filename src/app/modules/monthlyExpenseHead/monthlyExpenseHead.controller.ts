import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { MonthlyExpenseHeadService } from './monthlyExpenseHead.service';
import { MonthlyExpenseHead } from '@prisma/client';
import { monthlyExpenseHeadFilterableFields } from './monthlyExpenseHead.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await MonthlyExpenseHeadService.insertIntoDB(data);

  sendResponse<MonthlyExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, monthlyExpenseHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await MonthlyExpenseHeadService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<MonthlyExpenseHead[]>(res, {
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

  const result = await MonthlyExpenseHeadService.getSingle(id);

  sendResponse<MonthlyExpenseHead>(res, {
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

  const result = await MonthlyExpenseHeadService.updateSingle(id, data);

  sendResponse<MonthlyExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await MonthlyExpenseHeadService.deleteFromDB(id);

  sendResponse<MonthlyExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Head Deleted successfully',
    data: result,
  });
});

export const MonthlyExpenseHeadController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
