import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JewelleryTypeService } from './jewelleryType.service';
import { JewelleryType } from '@prisma/client';
import { jewelleryTypeFilterableFields } from './jewelleryType.constant';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await JewelleryTypeService.insertIntoDB(data);

  sendResponse<JewelleryType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Jewellery Type Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jewelleryTypeFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await JewelleryTypeService.getAll(filters, paginationOptions);

  sendResponse<JewelleryType[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jewellery Types retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryTypeService.getSingle(id);

  sendResponse<JewelleryType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jewellery Type retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await JewelleryTypeService.updateSingle(id, data);

  sendResponse<JewelleryType>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Jewellery Type Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryTypeService.deleteFromDB(id);

  sendResponse<JewelleryType>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Jewellery Type Deleted successfully',
    data: result,
  });
});

export const JewelleryTypeController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
