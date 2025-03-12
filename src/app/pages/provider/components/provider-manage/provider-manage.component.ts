import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { DocumentType } from "@shared/models/document-type.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { ProviderService } from "../../services/provider.service";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DocumentTypeService } from "@shared/services/document-type.service";

@Component({
  selector: "app-provider-manage",
  templateUrl: "./provider-manage.component.html",
  styleUrls: ["./provider-manage.component.scss"],
})
export class ProviderManageComponent implements OnInit {
  iconClose = IconsService.prototype.getIcon("icClose");
  configurations = configs;
  documentTypes: DocumentType[];
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _providerService: ProviderService,
    private _documentTypeService: DocumentTypeService,
    private _dialogRef: MatDialogRef<ProviderManageComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getListDocumentTypes();
    if (this.data != null) {
      this.providerById(this.data.data.providerId);
    }
  }

  ManageProvider(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const providerId = this.form.get("providerId").value;
    providerId > 0 ? this.updateProvider(providerId) : this.createProvider();
  }

  providerById(providerId: number): void {
    this._providerService.providerById(providerId).subscribe((response) => {
      this.form.reset({
        providerId: response.providerId,
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

  createProvider(): void {
    this._providerService
      .createProvider(this.form.value)
      .subscribe((response) => {
        if (response) {
          this._alertService.success("Sucess", response.message);
          this._dialogRef.close(true);
        } else {
          this._alertService.warn("Warning", response.message);
        }
      });
  }

  updateProvider(providerId: number): void {
    this._providerService
      .updateProvider(providerId, this.form.value)
      .subscribe((response) => {
        if (response) {
          this._alertService.success("Sucess", response.message);
          this._dialogRef.close(true);
        }
      });
  }

  getListDocumentTypes(): void {
    this._documentTypeService.listDocumentTypes().subscribe((response) => {
      this.documentTypes = response;
    });
  }

  initForm(): void {
    this.form = this._formBuilder.group({
      providerId: [0, [Validators.required]],
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
