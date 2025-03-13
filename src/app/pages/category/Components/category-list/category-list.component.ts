import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { CategoryService } from "src/app/pages/category/services/category.service";
import { componentSettings } from "./category-list-config";
import { DatesFilter } from "@shared/functions/actions";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { CategoryManageComponent } from "../category-manage/category-manage.component";
import Swal from "sweetalert2";
import { FiltersBox } from "@shared/models/search-options.interface";
import { BaseResponse } from "@shared/models/base-api-response.interface";

@Component({
  selector: "vex-category-list",
  templateUrl: "./category-list.component.html",
  styleUrls: ["./category-list.component.scss"],
  animations: [stagger40ms, scaleIn400ms, fadeInRight400ms],
})
export class CategoryListComponent implements OnInit {
  component;

  constructor(
    customTittle: CustomTitleService,
    public _categoryService: CategoryService,
    public _dialog: MatDialog
  ) {
    customTittle.set("Categories");
  }

  ngOnInit(): void {
    this.component = componentSettings;
  }

  setData(value: number) {
    this.component.filters.stateFilter = value;
    this.formatGetInputs();
  }

  search(data: FiltersBox) {
    this.component.filters.numFilter = data.searchValue;
    this.component.filters.textFilter = data.searchData;
    this.formatGetInputs();
  }

  datesFilterOpen() {
    DatesFilter(this);
  }

  formatGetInputs() {
    let inputs = {
      numFilter: 0,
      textFilter: "",
      stateFilter: null,
      startDate: null,
      endDate: null,
    };

    if (this.component.filters.numFilter != "") {
      inputs.numFilter = this.component.filters.numFilter;
      inputs.textFilter = this.component.filters.textFilter;
    }

    if (this.component.filters.stateFilter != null) {
      inputs.stateFilter = this.component.filters.stateFilter;
    }

    if (
      this.component.filters.startDate != "" &&
      this.component.filters.endDate != ""
    ) {
      inputs.startDate = this.component.filters.startDate;
      inputs.endDate = this.component.filters.endDate;
    }

    this.component.getInputs = inputs;
  }

  openDialogRegister() {
    this._dialog
      .open(CategoryManageComponent, {
        disableClose: true,
        width: "500px",
      })
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.formatGetInputs();
        }
      });
  }

  rowClick(e: any) {
    let action = e.action;
    let category = e.row;

    switch (action) {
      case "edit":
        this.CategoryEdit(category);
        break;
      case "delete":
        this.CategoryDelete(category);
        break;
    }
    return false;
  }

  CategoryEdit(row: BaseResponse) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = row.data;

    let dialogRef = this._dialog.open(CategoryManageComponent, {
      data: dialogConfig,
      disableClose: true,
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.formatGetInputs();
      }
    });
  }

  CategoryDelete(category: any) {
    Swal.fire({
      title: `Sure?${category.name}?`,
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
        this._categoryService
          .CategoryDelete(category.categoryId)
          .subscribe(() => this.formatGetInputs());
      }
    });
  }
}
