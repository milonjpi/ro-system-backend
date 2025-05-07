export type IOpeningBalanceFilters = {
  searchTerm?: string;
  sourceId?: string;
  startDate?: string;
  endDate?: string;
  year?: string;
  month?: string;
};

export type IPresentBalance = {
  year: string;
  month: string;
  amount: number;
  cost: number;
};
