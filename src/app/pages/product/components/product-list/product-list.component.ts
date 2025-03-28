import { Component, OnInit } from "@angular/core";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { ProductService } from "../../services/product.service";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProductComponentSettings } from "./product-list-config";
import { ProductResponse } from "../../models/product-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { ProductManageComponent } from "../product-manage/product-manage.component";
import Swal from "sweetalert2";
import { ProductStockWarehouseComponent } from "../product-stock-warehouse/product-stock-warehouse.component";

@Component({
  selector: "vex-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ProductListComponent implements OnInit {
  component: any;

  constructor(
    customTitle: CustomTitleService,
    public _productService: ProductService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Products");
  }

  ngOnInit(): void {
    this.component = ProductComponentSettings;
  }

  productOpenDialog() {
    this._dialog
      .open(ProductManageComponent, {
        disableClose: true,
        width: "400px",
        data: { mode: "create" },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsProduct(true);
        }
      });
  }

  rowClick(rowClick: RowClick<ProductResponse>) {
    let action = rowClick.action;
    let product = rowClick.row;
    switch (action) {
      case "edit":
        this.updateProduct(product);
        break;
      case "delete":
        this.deleteProduct(product);
        break;
      case "view":
        this.viewInfoProduct(product);
        break;
    }
    return false;
  }

  viewInfoProduct(product: ProductResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = product;

    this._dialog.open(ProductStockWarehouseComponent, {
      data: { dialogConfig },
    });
  }

  updateProduct(product: ProductResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = product;

    this._dialog
      .open(ProductManageComponent, {
        data: { dialogConfig, mode: "edit" },
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.setGetInputsProduct(true);
        }
      });
  }

  deleteProduct(product: ProductResponse) {
    Swal.fire({
      title: `Sure?${product.name}?`,
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
        this._productService
          .deleteProduct(product.productId)
          .subscribe(() => this.setGetInputsProduct(true));
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

  setGetInputsProduct(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatGetInputs();
  }

  get getDownloadUrl() {
    return `Product?Download=true`;
  }
}
