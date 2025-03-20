import { WarehouseComponentSettings } from "./warehouse-list-config";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { WarehouseService } from "../../services/warehouse.service";
import { MatDialog } from "@angular/material/dialog";
import { WarehouseResponse } from "../../models/warehouse-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { DateRange } from "@shared/models/search-options.interface";

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

  registerOpenDialog() {}

  updateWarehouse(warehouseData: WarehouseResponse) {}

  deleteWarehouse(warehouse: WarehouseResponse) {}

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
}
