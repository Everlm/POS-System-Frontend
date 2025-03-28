import { Component, Inject, OnInit } from "@angular/core";
import { IconsService } from "@shared/services/icons.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AlertService } from "@shared/services/alert.service";
import { WarehouseService } from "../../services/warehouse.service";
import { statesSelect } from "../../../../../static-data/configs";

@Component({
  selector: "app-warehouse-manage",
  templateUrl: "./warehouse-manage.component.html",
  styleUrls: ["./warehouse-manage.component.scss"],
})
export class WarehouseManageComponent implements OnInit {
  icClose: any;
  stateConfiguration = statesSelect;
  form: FormGroup;

  constructor(
    private _iconsService: IconsService,
    @Inject(MAT_DIALOG_DATA) public data,
    private _formBuilder: FormBuilder,
    private _alertService: AlertService,
    private _warehouseService: WarehouseService,
    private _dialogRef: MatDialogRef<WarehouseManageComponent>
  ) {
    this.icClose = this._iconsService.getIcon("icClose");
  }

  ngOnInit(): void {
    this.initForm();
    if (this.data.mode == "update") {
      this.warehouseById(this.data.dialogConfig.data.warehouseId);
    }
  }

  ManageWarehouse(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const warehouseId = this.form.get("warehouseId").value;
    warehouseId > 0
      ? this.updateWarehouse(warehouseId)
      : this.createWarehouse();
  }

  warehouseById(warehouseId: number): void {
    this._warehouseService.warehouseById(warehouseId).subscribe((response) => {
      this.form.reset({
        warehouseId: response.warehouseId,
        name: response.name,
        state: response.state,
      });
    });
  }

  createWarehouse(): void {
    this._warehouseService
      .createWarehouse(this.form.value)
      .subscribe((response) => {
        if (response) {
          this._alertService.success("Sucess", response.message);
          this._dialogRef.close(true);
        } else {
          this._alertService.warn("Warning", response.message);
        }
      });
  }

  updateWarehouse(warehouseId: number): void {
    this._warehouseService
      .updateWarehouse(warehouseId, this.form.value)
      .subscribe((response) => {
        if (response) {
          this._alertService.success("Sucess", response.message);
          this._dialogRef.close(true);
        }
      });
  }

  initForm(): void {
    this.form = this._formBuilder.group({
      warehouseId: [0, [Validators.required]],
      name: ["", [Validators.required]],
      state: ["", [Validators.required]],
    });
  }
}
