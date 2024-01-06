import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { FixedAssetService } from './fixedAsset.service';
import { FixedAsset } from '@prisma/client';
import { fixedAssetFilterableFields } from './fixedAsset.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FixedAssetService.insertIntoDB(data);

  sendResponse<FixedAsset>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fixed Asset Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fixedAssetFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await FixedAssetService.getAll(filters, paginationOptions);

  sendResponse<FixedAsset[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed Assets retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FixedAssetService.getSingle(id);

  sendResponse<FixedAsset>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed Asset retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await FixedAssetService.updateSingle(id, data);

  sendResponse<FixedAsset>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fixed Asset Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FixedAssetService.deleteFromDB(id);

  sendResponse<FixedAsset>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Fixed Asset Deleted successfully',
    data: result,
  });
});

export const FixedAssetController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
