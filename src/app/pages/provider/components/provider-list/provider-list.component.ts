import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { ProviderService } from "../../services/provider.service";
import { ProviderComponentSettings } from "./provider-list-config";
import { DateRange, FiltersBox } from "@shared/models/search-options.interface";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ProviderManageComponent } from "../provider-manage/provider-manage.component";
import { RowClick } from "@shared/models/row-click.interface";
import { ProviderResponse } from "../../models/provider-response.interface";
import Swal from "sweetalert2";

@Component({
  selector: "vex-provider-list",
  templateUrl: "./provider-list.component.html",
  styleUrls: ["./provider-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class ProviderListComponent implements OnInit {
  component: any;
  constructor(
    customTitle: CustomTitleService,
    public _providerService: ProviderService,
    public _dialog: MatDialog
  ) {
    customTitle.set("Proveedores");
  }

  ngOnInit(): void {
    this.component = ProviderComponentSettings;
  }

  rowClick(rowClick: RowClick<ProviderResponse>) {
    let action = rowClick.action;
    let provider = rowClick.row;
    switch (action) {
      case "edit":
        this.updateProvider(provider);
        break;
      case "delete":
        this.deleteProvider(provider);
        break;
    }
    return false;
  }

  updateProvider(providerData: ProviderResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = providerData;

    this._dialog
      .open(ProviderManageComponent, {
        data: dialogConfig,
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((response) => {
        if (response) {
          this.setGetInputsProviders(true);
        }
      });
  }

  deleteProvider(provider: ProviderResponse) {
    Swal.fire({
      title: `Sure?${provider.name}?`,
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
        this._providerService
          .deleteProvider(provider.providerId)
          .subscribe(() => this.setGetInputsProviders(true));
      }
    });
  }

  registerOpenDialog() {
    this._dialog
      .open(ProviderManageComponent, {
        disableClose: true,
        width: "400px",
      })
      .afterClosed()
      .subscribe((resp) => {
        if (resp) {
          this.setGetInputsProviders(true);
        }
      });
  }

  setMenu(value: number) {
    this.component.filters.stateFilter = value;
    this.formatgetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatgetInputs();
  }

  searchDateRange(date: DateRange) {
    this.component.filters.startDate = date.startDate;
    this.component.filters.endDate = date.endDate;
    this.formatgetInputs();
  }

  formatgetInputs() {
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

  setGetInputsProviders(refresh: boolean) {
    this.component.filters.refresh = refresh;
    this.formatgetInputs();
  }

  resetDateFilters() {
    this.component.filters = { ...this.component.resetFilters };
    this.formatgetInputs();
  }
  
  get getDownloadUrl() {
    return `Provider?Download=true`;
  }
}
