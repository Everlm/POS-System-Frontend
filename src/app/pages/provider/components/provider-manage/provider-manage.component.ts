import { Component, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import * as configs from "../../../../../static-data/configs";
import { DocumentType } from "@shared/models/document-type.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AlertService } from "@shared/services/alert.service";
import { ProviderService } from "../../services/provider.service";
import { MatDialogRef } from "@angular/material/dialog";
import { DocumentTypeService } from "@shared/services/document-type.service";

@Component({
  selector: "vex-provider-manage",
  templateUrl: "./provider-manage.component.html",
  styleUrls: ["./provider-manage.component.scss"],
})
export class ProviderManageComponent implements OnInit {
  iconClose = IconsService.prototype.getIcon("icClose");
  configurations = configs;
  documentTypes: DocumentType[];
  form: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _providerService: ProviderService,
    private _documentTypeService: DocumentTypeService,
    private _dialogRef: MatDialogRef<ProviderManageComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getListDocumentTypes();
  }

  // saveProvider(): void {
  //   if (this.form.invalid) {
  //     return Object.values(this.form.controls).forEach((control) => {
  //       control.markAllAsTouched();
  //     });
  //   }
  // }
  ManageProvider(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const providerId = this.form.get("providerId").value;
    providerId > 0 ? this.updateProvider(providerId) : this.createProvider();
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

  updateProvider(providerId: number): void {}

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
