import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { FosProductService } from './fosProduct.service';
import { FosProduct } from '@prisma/client';
import { fosProductFilterableFields } from './fosProduct.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await FosProductService.insertIntoDB(data);

  sendResponse<FosProduct>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, fosProductFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await FosProductService.getAll(filters, paginationOptions);

  sendResponse<FosProduct[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Products retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FosProductService.getSingle(id);

  sendResponse<FosProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await FosProductService.updateSingle(id, data);

  sendResponse<FosProduct>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Product Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await FosProductService.deleteFromDB(id);

  sendResponse<FosProduct>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product Deleted successfully',
    data: result,
  });
});

export const FosProductController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
