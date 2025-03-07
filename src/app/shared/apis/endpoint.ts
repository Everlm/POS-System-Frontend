import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
  LIST_CATEGORIES: "Category",
  LIST_SELECT_CATEGORY: "Category/Select",
  CATEGORY_BY_ID: "Category/",
  CATEGORY_REGISTER: "Category/Register/",
  CATEGORY_EDIT: "Category/Edit/",
  CATEGORY_DELETE: "Category/Delete/",

  //Provider Module
  LIST_PROVIDERS: "Provider",
  PROVIDER_REGISTER: "Provider/Register",

  //Document type module
  LIST_DOCUMENT_TYPES: "DocumentType",


  //AUTH MODULE
  LOGIN: "Auth/Login",
  LOGIN_GOOGLE: "Auth/LoginWithGoogle",
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
