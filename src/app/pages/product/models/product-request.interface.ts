export interface ProductRequest {
  productId: number;
  categoryId: number;
  code: string;
  name: string;
  stockMin: number;
  stockMax: number;
  unitSalePrice: number;
  image: File;
  state: number;
}
