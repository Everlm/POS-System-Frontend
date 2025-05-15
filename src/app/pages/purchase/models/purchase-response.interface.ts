export interface PurchaseResponse {
  purchaseId: number;
  provider: string;
  warehouse: string;
  totalAmount: number;
  dateOfPurchase: Date;
  icViewDetail: object;
  icCancel: object;
}

export interface ProductDetailResponse {
  productId: number;
  image: string;
  code: string;
  name: string;
  category: string;
  quantity: number;
  unitPurchasePrice: number;
  totalAmount: number;
  icAdd: object;
}

export interface PurchaseByIdResponse {
  purchaseId: number;
  providerId: number;
  warehouseId: number;
  observation: string;
  subTotal: number;
  tax: number;
  totalAmount: number;
  purchaseDetail: PurchaseDetailByIdResponse[];
}

export interface PurchaseDetailByIdResponse {
  productId: number;
  image: string;
  code: string;
  name: string;
  quantity: number;
  unitPurchasePrice: number;
  totalAmount: number;
}
