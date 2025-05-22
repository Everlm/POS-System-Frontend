export interface SaleResponse {
  saleId: number;
  customer: string;
  warehouse: string;
  voucherNumber: string;
  voucherDescription: string;
  observation: string;
  totalAmout: number;
  dateOfSale: Date;
  badgeColor: string;
  icViewDetail: object;
  icInvoice: object;
  icCancel: object;
}

export interface ProductDetailResponse {
  productId: number;
  image: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unitSalePrice: number;
  currentStock: number;
  totalAmount: number;
  icAdd: object;
}

export interface SaleByIdResponse {
  saleId: number;
  voucherDocumentTypeId: number;
  warehouseId: number;
  CustomerId: number;
  voucherNumber: string;
  observation: string;
  totalAmout: number;
  tax: number;
  subTotal: number;
  dateOfSale: Date;
  saleDetail: SaleDetailByIdResponse[];
}

export interface SaleDetailByIdResponse {
  productId: number;
  image: string;
  code: string;
  name: string;
  quantity: number;
  unitSalePrice: number;
  totalAmount: number;
}

export interface ProductStockByWarehouseIdResponse {
  productId: number;
  image: string;
  code: string;
  name: string;
  category: string;
  unitSalePrice: number;
  currentStock: number;
}
