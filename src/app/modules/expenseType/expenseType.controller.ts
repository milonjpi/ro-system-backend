import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ExpenseTypeService } from './expenseType.service';
import { ExpenseType } from '@prisma/client';
import { expenseTypeFilterableFields } from './expenseType.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ExpenseTypeService.insertIntoDB(data);

  sendResponse<ExpenseType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Type Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ExpenseTypeService.getAll(filters, paginationOptions);

  sendResponse<ExpenseType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseTypeService.getSingle(id);

  sendResponse<ExpenseType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Type retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ExpenseTypeService.updateSingle(id, data);

  sendResponse<ExpenseType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Type Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseTypeService.deleteFromDB(id);

  sendResponse<ExpenseType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Type Deleted successfully',
    data: result,
  });
});

export const ExpenseTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
