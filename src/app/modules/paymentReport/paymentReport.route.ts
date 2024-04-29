import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { PaymentReportController } from './paymentReport.controller';

const router = express.Router();

// get due report
router.get(
  '/due-report',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentReportController.dueReport
);

// get advance report
router.get(
  '/advance-report',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  PaymentReportController.advanceReport
);

export const PaymentReportRoutes = router;
