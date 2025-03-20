import { WarehouseComponentSettings } from "./warehouse-list-config";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { WarehouseService } from "../../services/warehouse.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { WarehouseResponse } from "../../models/warehouse-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { WarehouseManageComponent } from "../warehouse-manage/warehouse-manage.component";
import Swal from "sweetalert2";
@Component({
  selector: "app-warehouse-list",
  templateUrl: "./warehouse-list.component.html",
  styleUrls: ["./warehouse-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class WarehouseListComponent implements OnInit {
  component: any;

  constructor(
    customTitle: CustomTitleService,
    public _warehouseService: WarehouseService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Almacenes");
  }

  ngOnInit(): void {
    this.component = WarehouseComponentSettings;
  }

  rowClick(rowClick: RowClick<WarehouseResponse>) {
    let action = rowClick.action;
    let warehouse = rowClick.row;
    switch (action) {
      case "edit":
        this.updateWarehouse(warehouse);
        break;
      case "delete":
        this.deleteWarehouse(warehouse);
        break;
    }
    return false;
  }

  warehouseOpenDialog() {
    this._dialog
      .open(WarehouseManageComponent, {
        disableClose: true,
        width: "400px",
        data: { mode: "create" },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsWarehouse(true);
        }
      });
  }

  updateWarehouse(warehouseData: WarehouseResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = warehouseData;

    this._dialog
      .open(WarehouseManageComponent, {
        disableClose: true,
        width: "400px",
        data: { dialogConfig, mode: "update" },
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.setGetInputsWarehouse(true);
        }
      });
  }

  deleteWarehouse(warehouse: WarehouseResponse) {
    Swal.fire({
      title: `Sure?${warehouse.name}?`,
      text: "Delete allways",
      icon: "warning",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "#1D201D",
      cancelButtonColor: "#5DAD32",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      width: 420,
    }).then((result) => {
      if (result.isConfirmed) {
        this._warehouseService
          .deleteWarehouse(warehouse.warehouseId)
          .subscribe(() => this.setGetInputsWarehouse(true));
      }
    });
  }

  setMenu(value: number) {
    this.component.filters.stateFilter = value;
    this.formatGetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  searchDateRange(date: DateRange) {
    this.component.filters.startDate = date.startDate;
    this.component.filters.endDate = date.endDate;
    this.formatGetInputs();
  }

  resetDateFilters() {
    this.component.filters = { ...this.component.resetFilters };
    this.formatGetInputs();
  }

  formatGetInputs() {
    let str = "";

    if (this.component.filters.textFilter != null) {
      str += `&numFilter=${this.component.filters.numFilter}
      &textFilter=${this.component.filters.textFilter}`;
    }

    if (this.component.filters.stateFilter != null) {
      str += `&stateFilter=${this.component.filters.stateFilter}`;
    }

    if (
      this.component.filters.startDate != "" &&
      this.component.filters.endDate != ""
    ) {
      str += `&startDate=${this.component.filters.startDate}`;
      str += `&endDate=${this.component.filters.endDate}`;
    }

    if (this.component.filters.refresh) {
      let random = Math.random();
      str += `&refresh=${random}`;
      this.component.filters.refresh = false;
    }

    this.component.getInputs = str;
  }

  setGetInputsWarehouse(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Warehouse?Download=true`;
  }
}
