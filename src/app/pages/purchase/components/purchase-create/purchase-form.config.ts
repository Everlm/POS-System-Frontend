import { Validators } from "@angular/forms";

export const PurchaseFormConfig = [
  { name: "providerId", validators: [Validators.required] },
  { name: "warehouseId", validators: [Validators.required] },
  { name: "observation" },
];
