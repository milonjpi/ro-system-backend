import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserRole, DistVoucher } from '@prisma/client';
import { DistVoucherService } from './distVoucher.service';
import pick from '../../../shared/pick';
import { distVoucherFilterableFields } from './distVoucher.constant';
import { paginationFields } from '../../../constants/pagination';
import { IDistVoucherResponse } from './distVoucher.interface';

// receive payment
const receivePayment = catchAsync(async (req: Request, res: Response) => {
  const { invoices, distVoucherDetails, ...otherData } = req.body;
  const user = req.user as { id: string; role: UserRole };

  otherData.userId = user.id;

  const result = await DistVoucherService.receivePayment(
    otherData,
    invoices,
    distVoucherDetails
  );

  sendResponse<DistVoucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Successfully',
    data: result,
  });
});

// update receive payment
const updateReceivePayment = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const { invoices, distVoucherDetails, ...otherData } = req.body;

  const result = await DistVoucherService.updateReceivePayment(
    id,
    otherData,
    invoices,
    distVoucherDetails
  );

  sendResponse<DistVoucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Updated Successfully',
    data: result,
  });
});

// delete receive payment
const deleteReceiveDistVoucher = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id;
    const result = await DistVoucherService.deleteReceiveDistVoucher(id);

    sendResponse<DistVoucher>(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Payment Received Deleted Successfully',
      data: result,
    });
  }
);

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, distVoucherFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await DistVoucherService.getAll(filters, paginationOptions);

  sendResponse<IDistVoucherResponse>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vouchers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

export const DistVoucherController = {
  receivePayment,
  updateReceivePayment,
  deleteReceiveDistVoucher,
  getAll,
};
