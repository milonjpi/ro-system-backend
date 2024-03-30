import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { IncomeExpenseHeadService } from './incomeExpenseHead.service';
import { IncomeExpenseHead } from '@prisma/client';
import { incomeExpenseHeadFilterableFields } from './incomeExpenseHead.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await IncomeExpenseHeadService.insertIntoDB(data);

  sendResponse<IncomeExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Expense Head Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, incomeExpenseHeadFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await IncomeExpenseHeadService.getAll(
    filters,
    paginationOptions
  );

  sendResponse<IncomeExpenseHead[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Heads retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await IncomeExpenseHeadService.getSingle(id);

  sendResponse<IncomeExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Head retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await IncomeExpenseHeadService.updateSingle(id, data);

  sendResponse<IncomeExpenseHead>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Head Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await IncomeExpenseHeadService.deleteFromDB(id);

  sendResponse<IncomeExpenseHead>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Head Deleted successfully',
    data: result,
  });
});

export const IncomeExpenseHeadController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
