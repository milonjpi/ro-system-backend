import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../../enums/user';
import { VoucherValidation } from './voucher.validation';
import { VoucherController } from './voucher.controller';

const router = express.Router();

// receive payment
router.post(
  '/receive-payment',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(VoucherValidation.receivePayment),
  VoucherController.receivePayment
);

// update receive payment
router.patch(
  '/receive-payment/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  VoucherController.updateReceivePayment
);

// delete receive payment
router.delete(
  '/receive-payment/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  VoucherController.deleteReceiveVoucher
);

// make payment
router.post(
  '/make-payment',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  validateRequest(VoucherValidation.makePayment),
  VoucherController.makePayment
);

// get all
router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER),
  VoucherController.getAll
);

export const VoucherRoutes = router;
