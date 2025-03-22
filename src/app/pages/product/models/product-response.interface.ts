export interface ProductResponse {
  productId: number;
  category: string;
  code: string;
  name: string;
  stockMin: number;
  stockMax: number;
  unitSalePrice: number;
  image: string;
  state: number;
  stateProduct: string;
  auditCreateDate: Date;
  badgeColor: string;
  icView: object;
  icEdit: object;
  icDelete: object;
}

export interface ProductById {
  productId: number;
  categoryId: number;
  code: string;
  name: string;
  stockMin: number;
  stockMax: number;
  unitSalePrice: number;
  image?: string;
  state: number;
}
