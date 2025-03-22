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
  PROVIDER_BY_ID: "Provider/",
  PROVIDER_REGISTER: "Provider/Register",
  PROVIDER_UPDATE: "Provider/Edit/",
  PROVIDER_DELETE: "Provider/Delete/",

  //DocumentType module
  LIST_DOCUMENT_TYPES: "DocumentType",

  //Warehouse Module
  LIST_WAREHOUSES: "Warehouse",
  WAREHOUSE_BY_ID: "Warehouse/",
  WAREHOUSE_REGISTER: "Warehouse/Register",
  WAREHOUSE_UPDATE: "Warehouse/Edit/",
  WAREHOUSE_DELETE: "Warehouse/Remove/",

  //Product module
  LIST_PRODUCTS: "Product",
  
  //Auth module
  LOGIN: "Auth/Login",
  LOGIN_GOOGLE: "Auth/LoginWithGoogle",
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
