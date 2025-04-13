export type IOpeningBalanceFilters = {
  searchTerm?: string;
  year?: string;
  month?: string;
};


export type IPresentBalance = {
  cost: number;
  id: string;
  year: string;
  month: string;
  amount: number;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
};
