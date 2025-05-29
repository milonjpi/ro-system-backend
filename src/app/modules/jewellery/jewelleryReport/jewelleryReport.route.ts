import express from 'express';
import auth from '../../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../../enums/user';
import { JewelleryReportController } from './jewelleryReport.controller';

const router = express.Router();

// get summary
router.get(
  '/summary',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JewelleryReportController.getSummary
);

// get carat wise summary
router.get(
  '/carat',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JewelleryReportController.getCaratWiseSummary
);

// get type wise summary
router.get(
  '/type',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JewelleryReportController.getTypeWiseSummary
);

// get zakat
router.get(
  '/zakat',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  JewelleryReportController.getZakat
);

export const JewelleryReportRoutes = router;
