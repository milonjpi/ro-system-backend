import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { SourceService } from './source.service';
import { Source } from '@prisma/client';
import { sourceFilterableFields } from './source.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SourceService.insertIntoDB(data);

  sendResponse<Source>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Source Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, sourceFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await SourceService.getAll(filters, paginationOptions);

  sendResponse<Source[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sources retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SourceService.getSingle(id);

  sendResponse<Source>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Source retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await SourceService.updateSingle(id, data);

  sendResponse<Source>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Source Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SourceService.deleteFromDB(id);

  sendResponse<Source>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Source Deleted successfully',
    data: result,
  });
});

export const SourceController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
