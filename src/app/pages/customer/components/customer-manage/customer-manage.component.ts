import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DocumentType } from "@shared/models/document-type.interface";
import { AlertService } from "@shared/services/alert.service";
import { DocumentTypeService } from "@shared/services/document-type.service";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { CustomerService } from "../../services/customer.service";

@Component({
  selector: "app-customer-manage",
  templateUrl: "./customer-manage.component.html",
  styleUrls: ["./customer-manage.component.scss"],
})
export class CustomerManageComponent implements OnInit {
  iconClose = IconsService.prototype.getIcon("icClose");
  configurations = configs;
  documentTypes: DocumentType[];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _customerService: CustomerService,
    private _documentTypeService: DocumentTypeService,
    private _dialogRef: MatDialogRef<CustomerManageComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getListDocumentTypes();
    if (this.data.mode == "edit") {
      this.customerById(this.data.dialogConfig.data.clientId);
    }
  }

  ManageCustomer(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const customerId = this.form.get("clientId").value;
    customerId > 0 ? this.updateCustomer(customerId) : this.createCustomer();
  }

  createCustomer(): void {
    this._customerService
      .createCustomer(this.form.value)
      .subscribe((response) => {
        if (response) {
          this._alertService.success("Sucess", response.message);
          this._dialogRef.close(true);
        } else {
          this._alertService.warn("Warning", response.message);
        }
      });
  }

  updateCustomer(customerId: number): void {
    this._customerService
      .updateCustomer(customerId, this.form.value)
      .subscribe((response) => {
        if (response) {
          this._alertService.success("Sucess", response.message);
          this._dialogRef.close(true);
        }
      });
  }

  customerById(customerId: number): void {
    this._customerService.customerById(customerId).subscribe((response) => {
      this.form.reset({
        clientId: response.clientId,
        name: response.name,
        email: response.email,
        documentTypeId: response.documentTypeId,
        documentNumber: response.documentNumber,
        address: response.address,
        phone: response.phone,
        state: response.state,
      });
    });
  }

  getListDocumentTypes(): void {
    this._documentTypeService.listDocumentTypes().subscribe((response) => {
      this.documentTypes = response;
    });
  }

  initForm(): void {
    this.form = this._formBuilder.group({
      clientId: [0, [Validators.required]],
      name: ["", [Validators.required]],
      email: ["", [Validators.required]],
      documentTypeId: ["", [Validators.required]],
      documentNumber: ["", [Validators.required]],
      address: ["", [Validators.required]],
      phone: ["", [Validators.required, Validators.minLength(10)]],
      state: ["", [Validators.required]],
    });
  }
}
