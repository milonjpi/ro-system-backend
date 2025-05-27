import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { JewelleryUomService } from './jewelleryUom.service';
import { JewelleryUom } from '@prisma/client';
import { jewelleryUomFilterableFields } from './jewelleryUom.constant';
import catchAsync from '../../../../shared/catchAsync';
import sendResponse from '../../../../shared/sendResponse';
import pick from '../../../../shared/pick';
import { paginationFields } from '../../../../constants/pagination';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await JewelleryUomService.insertIntoDB(data);

  sendResponse<JewelleryUom>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Uom Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, jewelleryUomFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await JewelleryUomService.getAll(filters, paginationOptions);

  sendResponse<JewelleryUom[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryUomService.getSingle(id);

  sendResponse<JewelleryUom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await JewelleryUomService.updateSingle(id, data);

  sendResponse<JewelleryUom>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Uom Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await JewelleryUomService.deleteFromDB(id);

  sendResponse<JewelleryUom>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Uom Deleted successfully',
    data: result,
  });
});

export const JewelleryUomController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
