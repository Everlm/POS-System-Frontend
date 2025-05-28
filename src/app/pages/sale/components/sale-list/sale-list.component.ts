import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { SaleService } from "../../services/sale.service";
import { SaleComponentSettings } from "./sale-list-config";
import { SaleResponse } from "../../models/sale-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-sale-list",
  templateUrl: "./sale-list.component.html",
  styleUrls: ["./sale-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class SaleListComponent implements OnInit {
  component: any;
  readonly CREATE_SALE_ROUTE: string[] = ["/process-sale/create"];

  constructor(
    customTitle: CustomTitleService,
    public _saleService: SaleService,
    public _dialog: MatDialog,
    private _router: Router
  ) {
    customTitle.set("Sale");
  }

  ngOnInit(): void {
    this.component = SaleComponentSettings;
  }

  rowClick(rowClick: RowClick<SaleResponse>) {
    let action = rowClick.action;
    let sale = rowClick.row;
    switch (action) {
      case "viewDetail":
        this.viewSaleDetail(sale);
        break;
      case "cancel":
        this.cancelSale(sale);
        break;
    }
    return false;
  }

  newSale(): void {
    this._router.navigate(this.CREATE_SALE_ROUTE);
  }

  viewSaleDetail(sale: SaleResponse) {
    this._router.navigate(["/process-sale/create", sale.saleId]);
  }

  cancelSale(sale: SaleResponse) {
    Swal.fire({
      title: `Sure?`,
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
        this._saleService
          .cancelSale(sale.saleId)
          .subscribe(() => this.setGetInputs(true));
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

  setGetInputs(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Purcharse?Download=true`;
  }
}
