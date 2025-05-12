import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { PurchaseService } from "../../services/purchase.service";
import { PurchaseComponentSettings } from "./purchase-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { PurchaseResponse } from "../../models/purchase-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { Router } from "@angular/router";

@Component({
  selector: "app-purchase-list",
  templateUrl: "./purchase-list.component.html",
  styleUrls: ["./purchase-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class PurchaseListComponent implements OnInit {
  component: any;
  readonly CREATE_PURCHASE_ROUTE: string[] = ["/process-purchase/create"];

  constructor(
    customTitle: CustomTitleService,
    public _purchaseService: PurchaseService,
    public _dialog: MatDialog,
    private _router: Router
  ) {
    customTitle.set("Purchases");
  }

  ngOnInit(): void {
    this.component = PurchaseComponentSettings;
  }

  newPurcharse(): void {
    this._router.navigate(this.CREATE_PURCHASE_ROUTE);
  }

  rowClick(rowClick: RowClick<PurchaseResponse>) {
    let action = rowClick.action;
    let purchase = rowClick.row;
    switch (action) {
      case "viewDetail":
        this.viewPurchaseDetail(purchase);
        break;
      case "cancel":
        this.cancelPurchase(purchase);
        break;
    }
    return false;
  }

  viewPurchaseDetail(purchase: PurchaseResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = purchase;
  }
  cancelPurchase(purchase: PurchaseResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = purchase;
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

  setGetInputs(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Purcharse?Download=true`;
  }
}
