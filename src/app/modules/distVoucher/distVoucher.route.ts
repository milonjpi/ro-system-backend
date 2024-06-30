import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { DistVoucherValidation } from './distVoucher.validation';
import { DistVoucherController } from './distVoucher.controller';

const router = express.Router();

// receive payment
router.post(
  '/receive-payment',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(DistVoucherValidation.receivePayment),
  DistVoucherController.receivePayment
);

// update receive payment
router.patch(
  '/receive-payment/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistVoucherController.updateReceivePayment
);

// delete receive payment
router.delete(
  '/receive-payment/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistVoucherController.deleteReceiveDistVoucher
);

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  DistVoucherController.getAll
);

export const DistVoucherRoutes = router;
