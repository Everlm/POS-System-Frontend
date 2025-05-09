import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { CustomerService } from "../../services/customer.service";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CustomerComponentSettings } from "./customer-list-config";
import { CustomerResponse } from "../../models/customer-response.interface";
import { RowClick } from "@shared/models/row-click.interface";
import { CustomerManageComponent } from "../customer-manage/customer-manage.component";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import Swal from "sweetalert2";

@Component({
  selector: "app-customer-list",
  templateUrl: "./customer-list.component.html",
  styleUrls: ["./customer-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class CustomerListComponent implements OnInit {
  component: any;

  constructor(
    customTitle: CustomTitleService,
    public _customerService: CustomerService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Customers");
  }

  ngOnInit(): void {
    this.component = CustomerComponentSettings;
  }

  customerOpenDialog() {
    this._dialog
      .open(CustomerManageComponent, {
        disableClose: true,
        width: "400px",
        data: { mode: "create" },
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsCustomer(true);
        }
      });
  }

  rowClick(rowClick: RowClick<CustomerResponse>) {
    let action = rowClick.action;
    let customer = rowClick.row;
    switch (action) {
      case "edit":
        this.updateCustomer(customer);
        break;
      case "delete":
        this.deleteCustomer(customer);
        break;
    }
    return false;
  }

  updateCustomer(customer: CustomerResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = customer;

    this._dialog
      .open(CustomerManageComponent, {
        data: { dialogConfig, mode: "edit" },
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.setGetInputsCustomer(true);
        }
      });
  }

  deleteCustomer(customer: CustomerResponse) {
    Swal.fire({
      title: `Sure?${customer.name}?`,
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
        this._customerService
          .deleteCustomer(customer.clientId)
          .subscribe(() => this.setGetInputsCustomer(true));
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

  setGetInputsCustomer(refresh: boolean) {
    this.component.filters.refresh = refresh;
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

  get getDownloadUrl() {
    return `Product?Download=true`;
  }
}
