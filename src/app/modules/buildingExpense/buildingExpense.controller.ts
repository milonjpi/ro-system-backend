import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BuildingExpenseService } from './buildingExpense.service';
import { BuildingExpense } from '@prisma/client';
import { buildingExpenseFilterableFields } from './buildingExpense.constant';
import {
  IBuildingExpenseResponse,
  IExpenseSummary,
} from './buildingExpense.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { buildingPayments, ...data } = req.body;

  const result = await BuildingExpenseService.insertIntoDB(
    data,
    buildingPayments
  );

  sendResponse<BuildingExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingExpenseFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BuildingExpenseService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<IBuildingExpenseResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingExpenseService.getSingle(id);

  sendResponse<BuildingExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { buildingPayments, ...data } = req.body;

  const result = await BuildingExpenseService.updateSingle(
    id,
    data,
    buildingPayments
  );

  sendResponse<BuildingExpense>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BuildingExpenseService.deleteFromDB(id);

  sendResponse<BuildingExpense>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Deleted successfully',
    data: result,
  });
});

// get expense summary
const getExpenseSummary = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, buildingExpenseFilterableFields);
  const result = await BuildingExpenseService.getExpenseSummary(filters);

  sendResponse<IExpenseSummary[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expenses retrieved successfully',
    data: result,
  });
});

export const BuildingExpenseController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
  getExpenseSummary,
};
