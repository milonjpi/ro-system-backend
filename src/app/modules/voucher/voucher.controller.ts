import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import { UserRole, Voucher } from '@prisma/client';
import { VoucherService } from './voucher.service';
import pick from '../../../shared/pick';
import { voucherFilterableFields } from './voucher.constant';
import { paginationFields } from '../../../constants/pagination';

// receive payment
const receivePayment = catchAsync(async (req: Request, res: Response) => {
  const { invoices, voucherDetails, ...otherData } = req.body;
  const user = req.user as { id: string; role: UserRole };

  otherData.userId = user.id;

  const result = await VoucherService.receivePayment(
    otherData,
    invoices,
    voucherDetails
  );

  sendResponse<Voucher>(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Payment Received Successfully',
    data: result,
  });
});

// get all
const getAll = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, voucherFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);
  const result = await VoucherService.getAll(filters, paginationOptions);

  sendResponse<Voucher[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vouchers retrieved successfully',
    meta: result.meta,
    data: result.data,
  });
});

// // get single
// const getSingle = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;

//   const result = await ExpenseService.getSingle(id);

//   sendResponse<Expense>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Expense retrieved successfully',
//     data: result,
//   });
// });

// // update single
// const updateSingle = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const data = req.body;

//   const result = await ExpenseService.updateSingle(
//     id,
//     data?.data,
//     data?.expenseDetails
//   );

//   sendResponse<Expense>(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: 'Expense Updated Successfully',
//     data: result,
//   });
// });

// // delete
// const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
//   const id = req.params.id;

//   const result = await ExpenseService.deleteFromDB(id);

//   sendResponse<Expense>(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Expense Deleted successfully',
//     data: result,
//   });
// });

export const VoucherController = {
  receivePayment,
  getAll,
};
