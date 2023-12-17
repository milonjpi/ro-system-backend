import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { SubMenuPermissionValidation } from './subMenuPermission.validation';
import { SubMenuPermissionController } from './subMenuPermission.controller';

const router = express.Router();

// add menu
router.post(
  '/add',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(SubMenuPermissionValidation.create),
  SubMenuPermissionController.addSubMenu
);

// remove menu
router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SubMenuPermissionController.removeSubMenu
);

export const SubMenuPermissionRoutes = router;
