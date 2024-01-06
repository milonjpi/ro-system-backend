import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { InvestmentService } from './investment.service';
import { Investment } from '@prisma/client';
import { investmentFilterableFields } from './investment.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await InvestmentService.insertIntoDB(data);

  sendResponse<Investment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Investment Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, investmentFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await InvestmentService.getAll(filters, paginationOptions);

  sendResponse<Investment[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investments retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await InvestmentService.getSingle(id);

  sendResponse<Investment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await InvestmentService.updateSingle(id, data);

  sendResponse<Investment>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Investment Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await InvestmentService.deleteFromDB(id);

  sendResponse<Investment>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Investment Deleted successfully',
    data: result,
  });
});

export const InvestmentController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
