import { Request, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { paymentDueFilterableFields } from './paymentReport.constant';
import { PaymentReportService } from './paymentReport.service';
import {
  IPaymentAdvanceReport,
  IPaymentDueReport,
} from './paymentReport.interface';

// get due report
const dueReport = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, paymentDueFilterableFields);

  const result = await PaymentReportService.dueReport(filters);

  sendResponse<IPaymentDueReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendors due retrieved successfully',
    data: result,
  });
});

// get advance report
const advanceReport = catchAsync(async (req: Request, res: Response) => {
  const result = await PaymentReportService.advanceReport();

  sendResponse<IPaymentAdvanceReport[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Vendors Advance retrieved successfully',
    data: result,
  });
});

export const PaymentReportController = {
  dueReport,
  advanceReport,
};
