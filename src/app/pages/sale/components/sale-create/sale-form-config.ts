import { Validators } from "@angular/forms";

export const SaleFormConfig = [
  { name: "voucherDocumentTypeId", validators: [Validators.required] },
  { name: "voucherNumber", validators: [Validators.required] },
  { name: "customerId", validators: [Validators.required] },
  { name: "warehouseId", validators: [Validators.required] },
  { name: "observation" },
];
