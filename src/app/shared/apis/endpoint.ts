import { HttpHeaders } from "@angular/common/http";

export const endpoint = {
  LIST_CATEGORIES: "Category",
  LIST_SELECT_CATEGORY: "Category/Select",
  CATEGORY_BY_ID: "Category/",
  CATEGORY_REGISTER: "Category/Register/",
  CATEGORY_EDIT: "Category/Edit/",
  CATEGORY_DELETE: "Category/Delete/",

  //AUTH MODULE
  GENERATE_TOKEN: "User/Generate/Token",
};

export const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
  }),
};
