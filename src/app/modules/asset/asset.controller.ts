import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { AssetService } from './asset.service';
import { Asset } from '@prisma/client';
import { assetFilterableFields } from './asset.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await AssetService.insertIntoDB(data);

  sendResponse<Asset>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Asset Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, assetFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await AssetService.getAll(filters, paginationOptions);

  sendResponse<Asset[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Assets retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AssetService.getSingle(id);

  sendResponse<Asset>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Asset retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await AssetService.updateSingle(id, data);

  sendResponse<Asset>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Asset Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await AssetService.deleteFromDB(id);

  sendResponse<Asset>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Asset Deleted successfully',
    data: result,
  });
});

export const AssetController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
