import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JewelleryService } from './jewellery.service';
import { Jewellery } from '@prisma/client';
import { jewelleryFilterableFields } from './jewellery.constant';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';
import { IJewelleryResponse } from './jewellery.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { data } = req.body;

  const result = await JewelleryService.insertIntoDB(data);

  sendResponse<string>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Jewellery Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jewelleryFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await JewelleryService.getAll(filters, paginationOptions);

  sendResponse<IJewelleryResponse>(res, {
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

  const result = await JewelleryService.getSingle(id);

  sendResponse<Jewellery>(res, {
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

  const result = await JewelleryService.updateSingle(id, data);

  sendResponse<Jewellery>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Jewellery Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryService.deleteFromDB(id);

  sendResponse<Jewellery>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jewellery Deleted successfully',
    data: result,
  });
});

export const JewelleryController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
