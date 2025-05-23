import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { SelectAutoComplete } from "@shared/models/select-autocomplete.interface";
import { IconsService } from "@shared/services/icons.service";
import { SaleComponentSettings } from "../sale-list/sale-list-config";
import { WarehouseSelectService } from "@shared/services/warehouse-select.service";
import { CustomerSelectService } from "@shared/services/customer-select.service";
import { VoucherDocumentTypeSelectService } from "@shared/services/voucher-document-type-select.service";
import { SaleDetailService } from "../../services/sale-detail.service";
import { SaleFormConfig } from "./sale-form-config";
import { FiltersBox } from "@shared/models/search-options.interface";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { ProductDetailResponse } from "../../models/sale-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { SaleRequest } from "../../models/sale-request.interface";

@Component({
  selector: "vex-sale-create",
  templateUrl: "./sale-create.component.html",
  styleUrls: ["./sale-create.component.scss"],
  animations: [scaleIn400ms, fadeInRight400ms],
})
export class SaleCreateComponent implements OnInit {
  readonly BACK_SALE_ROUTE: string[] = ["process-sale"];
  saleDetailComponentConfig: any;
  isViewDetail: boolean = false;
  form: FormGroup;
  numRecordsProducts: number = 3;
  voucherDocumentTypes: SelectAutoComplete[];
  customers: SelectAutoComplete[];
  warehouses: SelectAutoComplete[];
  saleDetail: any | ProductDetailResponse[] = [];
  selectedWarehouseId: number;
  subtotal: number = 0;
  tax: number = 0;
  taxRate: number = 0.18;
  total: number = 0;
  saleId: number = 0;

  icDelete = IconsService.prototype.getIcon("icDelete");
  icRemove = IconsService.prototype.getIcon("icDelete");
  icSale = IconsService.prototype.getIcon("icProcess");

  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _voucherDocumentTypeSelectService: VoucherDocumentTypeSelectService,
    private _customerSelectService: CustomerSelectService,
    private _warehouseSelectService: WarehouseSelectService,
    public _saleDetailService: SaleDetailService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listCustomers();
    this.listVoucherDocumentTypes();
    this.listWarehouses();
    this.saleDetailComponentConfig = SaleComponentSettings;
  }

  initForm(): void {
    const group: any = {};
    SaleFormConfig.forEach((field) => {
      group[field.name] = this._formBuilder.control("", field.validators || []);
    });

    this.form = this._formBuilder.group(group);
  }

  rowClick(rowClick: RowClick<ProductDetailResponse>) {
    let action = rowClick.action;
    let products = rowClick.row;

    switch (action) {
      case "addDetail":
        this.addSaleDetail(products);
        console.log("hola");
        break;
    }

    return false;
  }
  addSaleDetail(products: ProductDetailResponse) {
    if (products.totalAmount <= 0) {
      return;
    }

    const productCopy = { ...products };

    const existingProduct = this.saleDetail.find(
      (item) => item.code === productCopy.code
    );

    if (existingProduct) {
      existingProduct.quantity += productCopy.quantity;
      existingProduct.totalAmount =
        existingProduct.quantity * existingProduct.unitPurcharsePrice;
    } else {
      this.saleDetail.push(productCopy);
    }

    this.saleDetailCalculations();
  }

  //TODO:Continuar
  createSale() {
    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach((controls) => {
        controls.markAllAsTouched();
      });
    }

    const sale: SaleRequest = {
      voucherNumber: this.form.value.voucherNumber,
      voucherDocumentTypeId: this.form.value.voucherDocumentTypeId,
      observation: this.form.value.observation,
      warehouseId: this.form.value.warehouseId,
      CustomerId: this.form.value.customerId,
      subTotal: this.subtotal,
      tax: this.tax,
      totalAmount: this.total,
      saleDetail: this.saleDetail.map((product: ProductDetailResponse) => ({
        productId: product.productId,
        quantity: product.quantity,
        unitSalePrice: product.unitSalePrice,
        total: product.totalAmount,
      })),
    };

    // this._purchaseService.createPurchase(purcharse).subscribe((resp) => {
    //   if (resp.isSuccess) {
    //     this._alert.success("Sucess", resp.message);
    //     this._router.navigate(["process-purchase"]);
    //   } else {
    //     this._alert.success("Alert", resp.message);
    //   }
    // });
  }

  deleteSaleDetail(product: ProductDetailResponse): void {
    this.saleDetail = this.saleDetail.filter(
      (p) => p.productId !== product.productId
    );

    console.log(
      "Después:",
      this.saleDetail.map((p) => p.productId)
    );

    this.saleDetailCalculations();
  }

  saleDetailCalculations(): void {
    this.calculateSubtotal();
    this.calculateTax();
    this.calculateTotal();
  }

  calculateSubtotal() {
    let subtotal = 0;
    for (const product of this.saleDetail) {
      subtotal += product.quantity * product.unitSalePrice;
    }
    this.subtotal = subtotal;
  }

  calculateTax() {
    this.tax = this.subtotal * this.taxRate;
    console.log();
  }

  calculateTotal() {
    this.total = this.subtotal + this.tax;
  }

  listVoucherDocumentTypes(): void {
    this._voucherDocumentTypeSelectService
      .listSelectVoucherDocumentTypes()
      .subscribe((resp) => {
        this.voucherDocumentTypes = resp;
      });
  }

  listCustomers(): void {
    this._customerSelectService.listSelectCustomers().subscribe((resp) => {
      this.customers = resp;
    });
  }

  listWarehouses(): void {
    this._warehouseSelectService.listSelectWarehouse().subscribe((resp) => {
      this.warehouses = resp;
    });
  }

  search(data: FiltersBox) {
    this.saleDetailComponentConfig.filters.numFilter = data.searchValue;
    this.saleDetailComponentConfig.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  formatGetInputs() {
    const { numFilter, textFilter } = this.saleDetailComponentConfig.filters;

    const queryParams = [];

    if (textFilter) {
      queryParams.push(`numFilter=${encodeURIComponent(numFilter)}`);
      queryParams.push(`textFilter=${encodeURIComponent(textFilter)}`);
    }

    if (this.selectedWarehouseId != null) {
      queryParams.push(`Id=${encodeURIComponent(this.selectedWarehouseId)}`);
    }

    this.saleDetailComponentConfig.getInputs =
      queryParams.length > 0 ? `&${queryParams.join("&")}` : "";
  }

  onItemSelected(id: number): void {
    this.selectedWarehouseId = id;
    this.formatGetInputs();
  }

  backRoute() {
    this._router.navigate(this.BACK_SALE_ROUTE);
  }
}
