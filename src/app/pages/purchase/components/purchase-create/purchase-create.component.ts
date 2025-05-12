import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { IconsService } from "@shared/services/icons.service";
import { ProviderSelectService } from "@shared/services/provider-select.service";
import { WarehouseSelectService } from "@shared/services/warehouse-select.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { PurchaseComponentSettings } from "../purchase-list/purchase-list-config";
import { FiltersBox } from "@shared/models/search-options.interface";
import { PurchaseDetailService } from "../../services/purchase-detail.service";
import { ProductDetailResponse } from "../../models/purchase-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { PurcharseRequest } from "../../models/purchase-request.interface";
import { PurchaseService } from "../../services/purchase.service";
import { AlertService } from "@shared/services/alert.service";

@Component({
  selector: "vex-purchase-create",
  templateUrl: "./purchase-create.component.html",
  styleUrls: ["./purchase-create.component.scss"],
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class PurchaseCreateComponent implements OnInit {
  readonly BACK_PURCHASE_ROUTE: string[] = ["process-purchase"];

  purchaseDetailComponentConfig: any;
  providerSelect: SelectAutoComplete[];
  warehouseSelect: SelectAutoComplete[];
  purchaseDetail: any | ProductDetailResponse[] = [];
  form: FormGroup;
  isViewDetail: boolean = false;
  numRecordsProducts: number = 3;
  subtotal: number = 0;
  tax: number = 0;
  total: number = 0;
  purcharseId: number = 0;
  icPurcharse = IconsService.prototype.getIcon("icProcess");
  icDelete = IconsService.prototype.getIcon("icDelete");
  icRemove = IconsService.prototype.getIcon("icDelete");

  constructor(
    private _providerSelectService: ProviderSelectService,
    private _warehouseSelectService: WarehouseSelectService,
    public _purchaseDetailService: PurchaseDetailService,
    private _purchaseService: PurchaseService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _alert: AlertService
  ) {
    // this.initform();
  }

  ngOnInit(): void {
    this.listSelectProviders();
    this.listSelectWarehouses();
    this.initform();
    this.purchaseDetailComponentConfig = PurchaseComponentSettings;
  }

  initform(): void {
    this.form = this._formBuilder.group({
      providerId: ["", Validators.required],
      warehouseId: ["", Validators.required],
      observation: [""],
    });
  }

  savePurchase() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const purcharse: PurcharseRequest = {
      observation: this.form.value.observation,
      warehouseId: this.form.value.warehouseId,
      providerId: this.form.value.providerId,
      subtotal: this.subtotal,
      tax: this.tax,
      totalAmount: this.total,
      purcharseDetails: this.purchaseDetail.map(
        (product: ProductDetailResponse) => ({
          productId: product.productId,
          quantity: product.quantity,
          unitPurcharsePrice: product.unitPurcharsePrice,
          total: product.totalAmount,
        })
      ),
    };

    this._purchaseService.createPurchase(purcharse).subscribe((resp) => {
      if (resp.isSuccess) {
        this._alert.success("Sucess", resp.message);
        this._router.navigate(["process-purchase"]);
      } else {
        this._alert.success("Atención", resp.message);
      }
    });
  }

  rowClick(rowClick: RowClick<ProductDetailResponse>) {
    let action = rowClick.action;
    let products = rowClick.row;

    switch (action) {
      case "addDetail":
        this.addPurchaseDetail(products);
        break;
    }

    return false;
  }

  addPurchaseDetail(products: ProductDetailResponse) {
    if (products.totalAmount <= 0) {
      return;
    }

    const productCopy = { ...products };

    const existingProduct = this.purchaseDetail.find(
      (item) => item.code === productCopy.code
    );

    if (existingProduct) {
      existingProduct.quantity += productCopy.quantity;
      existingProduct.totalAmount =
        existingProduct.quantity * existingProduct.unitPurcharsePrice;
    } else {
      this.purchaseDetail.push(productCopy);
    }

    this.calculateSubtotal();
    this.calculateTax();
    this.calculateTotal();
  }

  removePurchaseDetailFromCart(product: ProductDetailResponse) {
    const index = this.purchaseDetail.indexOf(product);

    if (index !== -1) {
      this.purchaseDetail.splice(index, 1);
    }

    this.calculateSubtotal();
    this.calculateTax();
    this.calculateTotal();
  }

  calculateSubtotal() {
    this.subtotal = this.purchaseDetail.reduce(
      (acc, product) => acc + product.quantity * product.unitPurcharsePrice,
      0
    );
  }

  calculateTax() {
    this.tax = this.subtotal * 0.18;
  }

  calculateTotal() {
    this.total = this.subtotal + this.tax;
  }

  search(data: FiltersBox) {
    this.purchaseDetailComponentConfig.filters.numFilter = data.searchValue;
    this.purchaseDetailComponentConfig.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  formatGetInputs() {
    // let str = "";

    // if (this.purchaseDetailComponentConfig.filters.textFilter != null) {
    //   str += `&numFilter=${this.purchaseDetailComponentConfig.filters.numFilter}&textFilter=${this.purchaseDetailComponentConfig.filters.textFilter}`;
    // }

    // this.purchaseDetailComponentConfig.getInputs = str;
    const { numFilter, textFilter } =
      this.purchaseDetailComponentConfig.filters;

    const queryParams = textFilter
      ? `&numFilter=${numFilter}&textFilter=${textFilter}`
      : "";

    this.purchaseDetailComponentConfig.getInputs = queryParams;
  }

  listSelectProviders(): void {
    this._providerSelectService
      .listSelectProvider()
      .subscribe((response) => (this.providerSelect = response));
  }

  listSelectWarehouses(): void {
    this._warehouseSelectService
      .listSelectWarehouse()
      .subscribe((response) => (this.warehouseSelect = response));
  }

  backRoute() {
    this._router.navigate(this.BACK_PURCHASE_ROUTE);
  }
}
