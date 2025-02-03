import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { UserRoutes } from '../modules/user/user.route';
import { MenuPermissionRoutes } from '../modules/menuPermission/menuPermission.route';
import { SubMenuPermissionRoutes } from '../modules/subMenuPermission/subMenuPermission.route';
import { SectionPermissionRoutes } from '../modules/sectionPermission/sectionPermission.route';
import { ProfileRoutes } from '../modules/profile/profile.route';
import { AccountTypeRoutes } from '../modules/accountType/accountType.route';
import { AccountHeadRoutes } from '../modules/accountHead/accountHead.route';
import { PaymentMethodRoutes } from '../modules/paymentMethod/paymentMethod.route';
import { CustomerRoutes } from '../modules/customer/customer.route';
import { VendorRoutes } from '../modules/vendor/vendor.route';
import { ProductRoutes } from '../modules/product/product.route';
import { OrderRoutes } from '../modules/order/order.route';
import { InvoiceRoutes } from '../modules/invoice/invoice.route';
import { BillRoutes } from '../modules/bill/bill.route';
import { UomRoutes } from '../modules/uom/uom.route';
import { EquipmentRoutes } from '../modules/equipment/equipment.route';
import { EquipmentInRoutes } from '../modules/equipmentIn/equipmentIn.route';
import { EquipmentOutRoutes } from '../modules/equipmentOut/equipmentOut.route';
import { ExpenseHeadRoutes } from '../modules/expenseHead/expenseHead.route';
import { ExpenseRoutes } from '../modules/expense/expense.route';
import { CustomerGroupRoutes } from '../modules/customerGroup/customerGroup.route';
import { CustomInvoiceRoutes } from '../modules/customInvoice/customInvoice.route';
import { VoucherRoutes } from '../modules/voucher/voucher.route';
import { ReportRoutes } from '../modules/report/report.route';
import { AssetRoutes } from '../modules/asset/asset.route';
import { FixedAssetRoutes } from '../modules/fixedAsset/fixedAsset.route';
import { InvestmentRoutes } from '../modules/investment/investment.route';
import { WithdrawRoutes } from '../modules/withdraw/withdraw.route';
import { IncomeExpenseCategoryRoutes } from '../modules/incomeExpenseCategory/incomeExpenseCategory.route';
import { IncomeExpenseHeadRoutes } from '../modules/incomeExpenseHead/incomeExpenseHead.route';
import { ModeOfPaymentRoutes } from '../modules/modeOfPayment/modeOfPayment.route';
import { IncomeExpenseRoutes } from '../modules/incomeExpense/incomeExpense.route';
import { PaymentReportRoutes } from '../modules/paymentReport/paymentReport.route';
import { DistClientRoutes } from '../modules/distClient/distClient.route';
import { DistVendorRoutes } from '../modules/distVendor/distVendor.route';
import { DistInvoiceRoutes } from '../modules/distInvoice/distInvoice.route';
import { DistVoucherRoutes } from '../modules/distVoucher/distVoucher.route';
import { DistReportRoutes } from '../modules/distReport/distReport.route';
import { DistExpenseRoutes } from '../modules/distExpense/distExpense.route';
import { FosCustomerRoutes } from '../modules/fosCustomer/fosCustomer.route';
import { FosProductRoutes } from '../modules/fosProduct/fosProduct.route';
import { FosInvoiceRoutes } from '../modules/fosInvoice/fosInvoice.route';
import { MeterRoutes } from '../modules/meter/meter.route';
import { DrCustomerRoutes } from '../modules/drCustomer/drCustomer.route';
import { DrProductRoutes } from '../modules/drProduct/drProduct.route';
import { DrInvoiceRoutes } from '../modules/drInvoice/drInvoice.route';
import { DrVoucherRoutes } from '../modules/drVoucher/drVoucher.route';
import { ElectricityBillRoutes } from '../modules/electricityBill/electricityBill.route';
import { DrSummaryRoutes } from '../modules/drReport/drReport.route';
import { BuildingExpenseHeadRoutes } from '../modules/buildingExpenseHead/buildingExpenseHead.route';
import { BuildingVendorRoutes } from '../modules/buildingVendor/buildingVendor.route';
import { BuildingBrandRoutes } from '../modules/buildingBrand/buildingBrand.route';
import { BuildingUomRoutes } from '../modules/buildingUom/buildingUom.route';
import { BuildingPaymentMethodRoutes } from '../modules/buildingPaymentMethod/buildingPaymentMethod.route';
import { BuildingPaymentRoutes } from '../modules/buildingPayment/buildingPayment.route';
import { BuildingInvestmentSourceRoutes } from '../modules/buildingInvestmentSource/buildingInvestmentSource.route';
import { BuildingInvestmentRoutes } from '../modules/buildingInvestment/buildingInvestment.route';
import { BuildingExpenseRoutes } from '../modules/buildingExpense/buildingExpense.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/profile',
    route: ProfileRoutes,
  },
  {
    path: '/menu-permission',
    route: MenuPermissionRoutes,
  },
  {
    path: '/subMenu-permission',
    route: SubMenuPermissionRoutes,
  },
  {
    path: '/section-permission',
    route: SectionPermissionRoutes,
  },
  {
    path: '/account-type',
    route: AccountTypeRoutes,
  },
  {
    path: '/account-head',
    route: AccountHeadRoutes,
  },
  {
    path: '/payment-method',
    route: PaymentMethodRoutes,
  },
  {
    path: '/customer-group',
    route: CustomerGroupRoutes,
  },
  {
    path: '/customer',
    route: CustomerRoutes,
  },
  {
    path: '/vendor',
    route: VendorRoutes,
  },
  {
    path: '/product',
    route: ProductRoutes,
  },
  {
    path: '/sales-order',
    route: OrderRoutes,
  },
  {
    path: '/invoice',
    route: InvoiceRoutes,
  },
  {
    path: '/custom-invoice',
    route: CustomInvoiceRoutes,
  },
  {
    path: '/bill',
    route: BillRoutes,
  },
  {
    path: '/uom',
    route: UomRoutes,
  },
  {
    path: '/equipment',
    route: EquipmentRoutes,
  },
  {
    path: '/equipment-in',
    route: EquipmentInRoutes,
  },
  {
    path: '/equipment-out',
    route: EquipmentOutRoutes,
  },
  {
    path: '/expense-head',
    route: ExpenseHeadRoutes,
  },
  {
    path: '/expense',
    route: ExpenseRoutes,
  },
  {
    path: '/voucher',
    route: VoucherRoutes,
  },
  {
    path: '/asset',
    route: AssetRoutes,
  },
  {
    path: '/fixed-asset',
    route: FixedAssetRoutes,
  },
  {
    path: '/investment',
    route: InvestmentRoutes,
  },
  {
    path: '/withdraw',
    route: WithdrawRoutes,
  },
  {
    path: '/report',
    route: ReportRoutes,
  },
  {
    path: '/payment-report',
    route: PaymentReportRoutes,
  },
  {
    path: '/income-expense-category',
    route: IncomeExpenseCategoryRoutes,
  },
  {
    path: '/income-expense-head',
    route: IncomeExpenseHeadRoutes,
  },
  {
    path: '/mode-of-payment',
    route: ModeOfPaymentRoutes,
  },
  {
    path: '/income-expense',
    route: IncomeExpenseRoutes,
  },
  {
    path: '/dist-client',
    route: DistClientRoutes,
  },
  {
    path: '/dist-vendor',
    route: DistVendorRoutes,
  },
  {
    path: '/dist-invoice',
    route: DistInvoiceRoutes,
  },
  {
    path: '/dist-expense',
    route: DistExpenseRoutes,
  },
  {
    path: '/dist-voucher',
    route: DistVoucherRoutes,
  },
  {
    path: '/dist-report',
    route: DistReportRoutes,
  },
  {
    path: '/fos-customer',
    route: FosCustomerRoutes,
  },
  {
    path: '/fos-product',
    route: FosProductRoutes,
  },
  {
    path: '/fos-invoice',
    route: FosInvoiceRoutes,
  },
  {
    path: '/meter',
    route: MeterRoutes,
  },
  {
    path: '/electricity-bill',
    route: ElectricityBillRoutes,
  },
  {
    path: '/dr-customer',
    route: DrCustomerRoutes,
  },
  {
    path: '/dr-product',
    route: DrProductRoutes,
  },
  {
    path: '/dr-invoice',
    route: DrInvoiceRoutes,
  },
  {
    path: '/dr-voucher',
    route: DrVoucherRoutes,
  },
  {
    path: '/dr-summary',
    route: DrSummaryRoutes,
  },
  {
    path: '/building-expense-head',
    route: BuildingExpenseHeadRoutes,
  },
  {
    path: '/building-vendor',
    route: BuildingVendorRoutes,
  },
  {
    path: '/building-brand',
    route: BuildingBrandRoutes,
  },
  {
    path: '/building-uom',
    route: BuildingUomRoutes,
  },
  {
    path: '/building-expense',
    route: BuildingExpenseRoutes,
  },
  {
    path: '/building-payment-method',
    route: BuildingPaymentMethodRoutes,
  },
  {
    path: '/building-payment',
    route: BuildingPaymentRoutes,
  },
  {
    path: '/building-investment-source',
    route: BuildingInvestmentSourceRoutes,
  },
  {
    path: '/building-investment',
    route: BuildingInvestmentRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
