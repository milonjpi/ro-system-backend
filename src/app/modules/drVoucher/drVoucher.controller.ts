import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserRole, DrVoucher } from '@prisma/client';
import { DrVoucherService } from './drVoucher.service';
import pick from '../../../shared/pick';
import { drVoucherFilterableFields } from './drVoucher.constant';
import { paginationFields } from '../../../constants/pagination';
import { IDrVoucherResponse } from './drVoucher.interface';

// create
const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  const { invoices, drVoucherDetails, ...data } = req.body;

  const user = req.user as { id: string; role: UserRole };

  data.userId = user.id;

  const result = await DrVoucherService.insertIntoDB(
    data,
    invoices,
    drVoucherDetails
  );

  sendResponse<DrVoucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, drVoucherFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DrVoucherService.getAll(filters, paginationOptions);

  sendResponse<IDrVoucherResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vouchers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// update
const updateSingle = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { invoices, drVoucherDetails, ...data } = req.body;

  const result = await DrVoucherService.updateSingle(
    id,
    data,
    invoices,
    drVoucherDetails
  );

  sendResponse<DrVoucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Updated Successfully',
    data: result,
  });
});

// delete
const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await DrVoucherService.deleteFromDB(id);

  sendResponse<DrVoucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Deleted Successfully',
    data: result,
  });
});

export const DrVoucherController = {
  insertIntoDB,
  getAll,
  updateSingle,
  deleteFromDB,
};
