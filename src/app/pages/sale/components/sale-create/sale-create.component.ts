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
  selectedWarehouseId: number;

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
    // let str = "";

    // if (this.saleDetailComponentConfig.filters.textFilter != null) {
    //   str += `&numFilter=${this.saleDetailComponentConfig.filters.numFilter}&textFilter=${this.saleDetailComponentConfig.filters.textFilter}`;
    // }

    // str += `&Id=${this.selectedWarehouseId}`;

    // this.saleDetailComponentConfig.getInputs = str;
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
