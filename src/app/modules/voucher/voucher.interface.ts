export type IVoucherFilters = {
  searchTerm?: string;
  startDate?: string;
  endDate?: string;
  customerId?: string;
  vendorId?: string;
  userId?: string;
  type?: string;
};

export type IVoucherDetail = {
  voucherId: string;
  invoiceId: string;
  receiveAmount: number;
};
