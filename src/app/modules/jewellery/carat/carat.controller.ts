import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { CaratService } from './carat.service';
import { Carat } from '@prisma/client';
import { caratFilterableFields } from './carat.constant';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await CaratService.insertIntoDB(data);

  sendResponse<Carat>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'KDM Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, caratFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await CaratService.getAll(filters, paginationOptions);

  sendResponse<Carat[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KDMs retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CaratService.getSingle(id);

  sendResponse<Carat>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KDM retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await CaratService.updateSingle(id, data);

  sendResponse<Carat>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'KDM Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await CaratService.deleteFromDB(id);

  sendResponse<Carat>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'KDM Deleted successfully',
    data: result,
  });
});

export const CaratController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
