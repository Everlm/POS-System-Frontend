import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
  //Category module
  LIST_CATEGORIES: "Category",
  LIST_SELECT_CATEGORY: "Category/Select",
  CATEGORY_BY_ID: "Category/",
  CATEGORY_REGISTER: "Category/Register/",
  CATEGORY_EDIT: "Category/Edit/",
  CATEGORY_DELETE: "Category/Delete/",

  //Provider module
  LIST_PROVIDERS: "Provider",
  LIST_SELECT_PROVIDER: "Provider/Select",
  PROVIDER_BY_ID: "Provider/",
  PROVIDER_REGISTER: "Provider/Register",
  PROVIDER_UPDATE: "Provider/Edit/",
  PROVIDER_DELETE: "Provider/Delete/",

  //DocumentType module
  LIST_DOCUMENT_TYPES: "DocumentType",

  //Warehouse Module
  LIST_WAREHOUSES: "Warehouse",
  LIST_SELECT_WAREHOUSE: "Warehouse/Select",
  WAREHOUSE_BY_ID: "Warehouse/",
  WAREHOUSE_REGISTER: "Warehouse/Register",
  WAREHOUSE_UPDATE: "Warehouse/Edit/",
  WAREHOUSE_DELETE: "Warehouse/Remove/",

  //Product module
  LIST_PRODUCTS: "Product",
  PRODUCT_BY_ID: "Product/",
  PRODUCT_STOCK_BY_WAREHOUSE: "Product/productStockByWarehouse/",
  PRODUCT_REGISTER: "Product/Register",
  PRODUCT_UPDATE: "Product/Edit/",
  PRODUCT_DELETE: "Product/Remove/",

  //Customer module
  LIST_CUSTOMERS: "Customer",
  LIST_SELECT_CUSTOMERS: "Customer/Select",
  CUSTOMER_BY_ID: "Customer/",
  CUSTOMER_CREATE: "Customer/Create",
  CUSTOMER_UPDATE: "Customer/Update/",
  CUSTOMER_DELETE: "Customer/Delete/",

  //Purchase module
  LIST_PURCHASE: "Purcharse",
  PURCHASE_BY_ID: "Purcharse/",
  PURCHASE_CREATE: "Purcharse/Create",
  PURCHASE_CANCEL: "Purcharse/Cancel/",

  //Sale module
  LIST_SALE: "Sale",
  PRODUCT_STOCK_WAREHOUSE_ID: "Sale/ProductStockByWarehouse",
  SALE_BY_ID: "Sale/",
  SALE_CREATE: "Sale/Create",
  SALE_CANCEL: "Sale/Cancel/",

  //VoucherDocumentType module
  LIST_SELECT_VOUCHER_DOCUMENT_TYPE: "VoucherDoumentType/Select",

  //Auth module
  LOGIN: "Auth/Login",
  REFRESH_TOKEN: "Auth/refresh-token",
  LOGIN_GOOGLE: "Auth/LoginWithGoogle",
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
