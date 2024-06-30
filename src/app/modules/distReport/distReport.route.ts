import express from 'express';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DistReportController } from './distReport.controller';

const router = express.Router();

// get due report
router.get(
  '/due-report',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistReportController.dueReport
);

// get advance report
router.get(
  '/advance-report',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistReportController.advanceReport
);

// get advance report
router.get(
  '/summary',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistReportController.summary
);

// get vendor due advanced
router.get(
  '/due-advance',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistReportController.vendorDueAdvanced
);

router.get(
  '/dashboard',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistReportController.dashboardData
);

export const DistReportRoutes = router;
