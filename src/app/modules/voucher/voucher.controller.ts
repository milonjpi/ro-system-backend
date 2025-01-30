import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserRole, Voucher } from '@prisma/client';
import { VoucherService } from './voucher.service';
import pick from '../../../shared/pick';
import { voucherFilterableFields } from './voucher.constant';
import { paginationFields } from '../../../constants/pagination';
import { IVoucherResponse } from './voucher.interface';

// receive payment
const receivePayment = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const user = req.user as { id: string; role: UserRole };

  data.userId = user.id;

  const result = await VoucherService.receivePayment(data);

  sendResponse<Voucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Successfully',
    data: result,
  });
});

// update receive payment
const updateReceivePayment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const data = req.body;

  const result = await VoucherService.updateReceivePayment(id, data);

  sendResponse<Voucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Updated Successfully',
    data: result,
  });
});

// delete receive payment
const deleteReceiveVoucher = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await VoucherService.deleteReceiveVoucher(id);

  sendResponse<Voucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Deleted Successfully',
    data: result,
  });
});

// make payment
const makePayment = catchAsync(async (req: Request, res: Response) => {
  const { bills, voucherDetails, ...otherData } = req.body;
  const user = req.user as { id: string; role: UserRole };

  otherData.userId = user.id;

  const result = await VoucherService.makePayment(
    otherData,
    bills,
    voucherDetails
  );

  sendResponse<Voucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Made Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, voucherFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await VoucherService.getAll(filters, paginationOptions);

  sendResponse<IVoucherResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vouchers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const VoucherController = {
  receivePayment,
  updateReceivePayment,
  deleteReceiveVoucher,
  makePayment,
  getAll,
};
