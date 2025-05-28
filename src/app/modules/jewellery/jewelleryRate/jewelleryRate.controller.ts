import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JewelleryRateService } from './jewelleryRate.service';
import { JewelleryRate } from '@prisma/client';
import { jewelleryRateFilterableFields } from './jewelleryRate.constant';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await JewelleryRateService.insertIntoDB(data);

  sendResponse<JewelleryRate>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rate Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jewelleryRateFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await JewelleryRateService.getAll(filters, paginationOptions);

  sendResponse<JewelleryRate[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rates retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get distinct date
const getDistinctDate = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jewelleryRateFilterableFields);
  const result = await JewelleryRateService.getDistinctDate(filters);

  sendResponse<JewelleryRate[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Dates retrieved successfully',
    data: result,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryRateService.getSingle(id);

  sendResponse<JewelleryRate>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rate retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await JewelleryRateService.updateSingle(id, data);

  sendResponse<JewelleryRate>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Rate Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryRateService.deleteFromDB(id);

  sendResponse<JewelleryRate>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Rate Deleted successfully',
    data: result,
  });
});

export const JewelleryRateController = {
  insertIntoDB,
  getAll,
  getDistinctDate,
  getSingle,
  updateSingle,
  deleteFromDB,
};
