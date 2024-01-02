export type IEquipmentFilters = {
  searchTerm?: string;
  isAsset?: string;
};

export type IEquipmentResponse = {
  id: string;
  label: string;
  uom: string | null;
  isAsset: boolean;
  totalQty: number | null | undefined;
  unitPrice: number | null | undefined;
  totalPrice: number | null | undefined;
  usedQty: number | null | undefined;
};
