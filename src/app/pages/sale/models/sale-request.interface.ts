export interface SaleRequest {
  voucherDocumentTypeId: number;
  warehouseId: number;
  CustomerId: number;
  voucherNumber: string;
  observation: string;
  subTotal: number;
  tax: number;
  totalAmout: number;
  saleDetail: SaleDetailRequest[];
}

export interface SaleDetailRequest {
  productId: number;
  quantity: number;
  unitSalePrice: number;
  total: number;
}
