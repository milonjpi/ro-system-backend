import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { SoldJewelleryService } from './soldJewellery.service';
import { SoldJewellery } from '@prisma/client';
import { soldJewelleryFilterableFields } from './soldJewellery.constant';
import { ISoldJewelleryResponse } from './soldJewellery.interface';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await SoldJewelleryService.insertIntoDB(data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Jewellery Sold Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, soldJewelleryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await SoldJewelleryService.getAll(filters, paginationOptions);

  sendResponse<ISoldJewelleryResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jewelleries retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SoldJewelleryService.getSingle(id);

  sendResponse<SoldJewellery>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jewellery retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await SoldJewelleryService.updateSingle(id, data);

  sendResponse<SoldJewellery>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Sold Doc Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await SoldJewelleryService.deleteFromDB(id);

  sendResponse<SoldJewellery>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Sold Doc Deleted successfully',
    data: result,
  });
});

export const SoldJewelleryController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
