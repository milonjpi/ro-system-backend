import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { SectionPermissionValidation } from './sectionPermission.validation';
import { SectionPermissionController } from './sectionPermission.controller';

const router = express.Router();

// add section
router.post(
  '/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  validateRequest(SectionPermissionValidation.create),
  SectionPermissionController.addSection
);

// remove section
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SectionPermissionController.removeSection
);

export const SectionPermissionRoutes = router;
