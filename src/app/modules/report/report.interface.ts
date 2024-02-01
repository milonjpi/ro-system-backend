import {
  Customer,
  EquipmentIn,
  EquipmentOut,
  Expense,
  Investment,
  Voucher,
} from '@prisma/client';

// due types
export type IDueFilters = {
  customerId?: string;
  startDate?: string;
  endDate?: string;
  minDue?: string;
  maxDue?: string;
};

export type IDueInvoice = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastSaleDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};

// advance types
export type IAdvanceInvoice = {
  amount: number | null | undefined;
  paidAmount: number | null | undefined;
  receiveAmount: number | null | undefined;
  lastPaymentDate: Date | null | undefined;
  lastSaleDate: Date | null | undefined;
  differentAmount: number | null | undefined;
};

export type IDueReport = Customer | IDueInvoice;
export type IAdvanceReport = Customer | IAdvanceInvoice;

// summary types
export type IProductSum = {
  year: string;
  month: string;
  productId: string;
  quantity: number;
};

export type IInvoiceSummary = {
  year: string;
  month: string;
  totalQty: number;
  totalPrice: number;
  discount: number;
  amount: number;
  paidAmount: number;
  products: IProductSum[];
};

// balance sheet
type IEquipmentIn = Pick<EquipmentIn, 'equipmentId'> & {
  _sum: { totalPrice: number | null; quantity: number | null };
  _avg: { unitPrice: number | null };
};

type IEquipmentOut = Pick<EquipmentOut, 'equipmentId'> & {
  _sum: { quantity: number | null };
};

type IExpenses = Pick<Expense, 'expenseHeadId'> & {
  _sum: { amount: number | null };
};

type IVoucher = Pick<Voucher, 'type'> & {
  _sum: { amount: number | null };
};

type IInvestment = Pick<Investment, 'isCash'> & {
  _sum: { amount: number | null };
};

export type IBalanceSheet = {
  invoices: {
    _sum: {
      amount: number | null;
      paidAmount: number | null;
    };
  };
  bills: {
    _sum: {
      amount: number | null;
      paidAmount: number | null;
    };
  };
  equipmentIn: IEquipmentIn[];
  equipmentOut: IEquipmentOut[];
  expenses: IExpenses[];
  fixedAssets: {
    _sum: {
      amount: number | null;
    };
  };
  investments: IInvestment[];
  withdraws: {
    _sum: {
      amount: number | null;
    };
  };
  vouchers: IVoucher[];
};
