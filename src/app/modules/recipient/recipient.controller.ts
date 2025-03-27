import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { RecipientService } from './recipient.service';
import { Recipient } from '@prisma/client';
import { recipientFilterableFields } from './recipient.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await RecipientService.insertIntoDB(data);

  sendResponse<Recipient>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Recipient Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, recipientFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await RecipientService.getAll(filters, paginationOptions);

  sendResponse<Recipient[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipients retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RecipientService.getSingle(id);

  sendResponse<Recipient>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipient retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await RecipientService.updateSingle(id, data);

  sendResponse<Recipient>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Recipient Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await RecipientService.deleteFromDB(id);

  sendResponse<Recipient>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recipient Deleted successfully',
    data: result,
  });
});

export const RecipientController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
