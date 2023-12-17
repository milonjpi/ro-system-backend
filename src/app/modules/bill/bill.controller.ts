import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paginationFields } from '../../../constants/pagination';
import { BillService } from './bill.service';
import { Bill } from '@prisma/client';
import { billFilterableFields } from './bill.constant';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;

  const result = await BillService.insertIntoDB(
    data?.data,
    data?.billEquipments
  );

  sendResponse<Bill>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bill Created Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, billFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await BillService.getAll(filters, paginationOptions);

  sendResponse<Bill[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bills retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// get single
const getSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BillService.getSingle(id);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill retrieved successfully',
    data: result,
  });
});

// update single
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await BillService.updateSingle(
    id,
    data?.data,
    data?.billEquipments
  );

  sendResponse<Bill>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bill Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  const result = await BillService.deleteFromDB(id);

  sendResponse<Bill>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bill Deleted successfully',
    data: result,
  });
});

export const BillController = {
  insertIntoDB,
  getAll,
  getSingle,
  updateSingle,
  deleteFromDB,
};
