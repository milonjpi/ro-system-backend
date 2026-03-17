import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { ZakatValueService } from './zakatValue.service';
import { ZakatValue } from '@prisma/client';
import { zakatValueFilterableFields } from './zakatValue.constant';
import { ISingleZakatValue, IZakatValueResponse } from './zakatValue.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await ZakatValueService.insertIntoDB(data);

  sendResponse<ZakatValue>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Zakat Value Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, zakatValueFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await ZakatValueService.getAll(filters, paginationOptions);

  sendResponse<IZakatValueResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Zakat Values retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ZakatValueService.getSingle(id);

  sendResponse<ISingleZakatValue>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Zakat Value retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await ZakatValueService.updateSingle(id, data);

  sendResponse<ZakatValue>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Zakat Value Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await ZakatValueService.deleteFromDB(id);

  sendResponse<ZakatValue>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Zakat Value Deleted successfully',
    data: result,
  });
});

export const ZakatValueController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
