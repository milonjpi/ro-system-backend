import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ExpenseAreaService } from './expenseArea.service';
import { ExpenseArea } from '@prisma/client';
import { expenseAreaFilterableFields } from './expenseArea.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ExpenseAreaService.insertIntoDB(data);

  sendResponse<ExpenseArea>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Area Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, expenseAreaFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ExpenseAreaService.getAll(filters, paginationOptions);

  sendResponse<ExpenseArea[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Areas retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseAreaService.getSingle(id);

  sendResponse<ExpenseArea>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Area retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ExpenseAreaService.updateSingle(id, data);

  sendResponse<ExpenseArea>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Area Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ExpenseAreaService.deleteFromDB(id);

  sendResponse<ExpenseArea>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense Area Deleted successfully',
    data: result,
  });
});

export const ExpenseAreaController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
