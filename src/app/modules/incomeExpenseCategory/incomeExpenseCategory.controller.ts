import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IncomeExpenseCategoryService } from './incomeExpenseCategory.service';
import { IncomeExpenseCategory } from '@prisma/client';
import { incomeExpenseCategoryFilterableFields } from './incomeExpenseCategory.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await IncomeExpenseCategoryService.insertIntoDB(data);

  sendResponse<IncomeExpenseCategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, incomeExpenseCategoryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await IncomeExpenseCategoryService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<IncomeExpenseCategory[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Categories retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await IncomeExpenseCategoryService.getSingle(id);

  sendResponse<IncomeExpenseCategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await IncomeExpenseCategoryService.updateSingle(id, data);

  sendResponse<IncomeExpenseCategory>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Category Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await IncomeExpenseCategoryService.deleteFromDB(id);

  sendResponse<IncomeExpenseCategory>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Category Deleted successfully',
    data: result,
  });
});

export const IncomeExpenseCategoryController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
