import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { scaleFadeIn400ms } from "src/@vex/animations/scale-fade-in.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from "@angular/material/paginator";
import { getEsPaginatorIntl } from "@shared/paginator-intl/es-paginator-intl";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
  MatFormFieldModule,
} from "@angular/material/form-field";
import { DefaultService } from "@shared/services/default.service";
import {
  TableColumns,
  TableFooter,
} from "../../../models/list-table.interface";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { AlertService } from "@shared/services/alert.service";
import { startWith, switchMap } from "rxjs/operators";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { IconModule } from "@visurel/iconify-angular";
import { IconsService } from "@shared/services/icons.service";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "@shared/shared.module";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Component({
  selector: "app-list-table",
  standalone: true,
  imports: [
    CommonModule,
    NgxSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    IconModule,
    MatPaginatorModule,
    MatFormFieldModule,
    FormsModule,
    SharedModule,
  ],
  templateUrl: "./list-table.component.html",
  styleUrls: ["./list-table.component.scss"],
  animations: [scaleFadeIn400ms, fadeInUp400ms],
  providers: [
    {
      provide: MatPaginatorIntl,
      useValue: getEsPaginatorIntl(),
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "standard" } as MatFormFieldDefaultOptions,
    },
  ],
})
export class ListTableComponent<T> implements OnInit, AfterViewInit, OnChanges {
  @Input() service?: DefaultService;
  @Input() columns?: TableColumns<T>[];
  @Input() getInputs: any;
  @Input() sortBy?: string;
  @Input() sortDir: string = "asc";
  @Input() footer: TableFooter<T>[] = [];
  @Input() numRecords?: number = 10;

  @Output() rowClick = new EventEmitter<T>();

  @ViewChild(MatPaginator) paginator?: MatPaginator;
  @ViewChild(MatSort) sort?: MatSort;

  changesGetInputs = new EventEmitter<T>();

  dataSource = new MatTableDataSource<T>();

  visibleColumns?: Array<keyof T | string>;
  visibleFooter?: Array<keyof T | string | object>;

  paginatorOptions = {
    pageSizeOptions: [this.numRecords, 20, 50],
    pageSize: this.numRecords,
    pageLength: 0,
  };

  icMin = IconsService.prototype.getIcon("icMin");
  icAdd = IconsService.prototype.getIcon("icAddDetail");

  constructor(
    private _spinner: NgxSpinnerService,
    private _alert: AlertService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.columns) {
      this.setVisibleColumns();
    }
    if (changes.getInputs && this.paginator) {
      this.paginator.pageIndex = 0;
      this.changesGetInputs.emit();
    }
  }

  setVisibleColumns() {
    this.visibleColumns = this.columns
      .filter((columns: any) => columns.visible)
      .map((columns: any) => columns.property);
  }

  ngAfterViewInit(): void {
    this.getDataByService();
    this.sortChanges();
    this.paginatorChanges();
  }

  async getDataByService() {
    this.changesGetInputs
      .pipe(
        startWith(""),
        switchMap(() => {
          this._spinner.show("modal-table");
          return this.service.GetAll(
            this.paginator.pageSize,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.getInputs
          );
        })
      )
      .subscribe((data: any) => {
        this.setData(data);
        this._spinner.hide("modal-table");
      });
  }

  setData(data: any) {
    if (data.isSuccess) {
      this.setVisibleColumns();
      this.paginatorOptions.pageLength = data.totalRecords;
      this.dataSource.data = data.data;
      if (data.footer) this.setFooter(data.footer);
    } else {
      this._alert.warn("Error", "Error Loading Data");
    }
  }

  setFooter(data: any) {
    this.visibleFooter = [];
    if (this.footer.length && data) {
      this.footer.forEach((e) => {
        this.visibleFooter.push({
          label: e.label,
          value: data[e.property],
          tooltip: e.tooltip,
        });
      });
    }
  }

  sortChanges() {
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.changesGetInputs.emit();
    });
  }

  paginatorChanges() {
    this.paginator.page.subscribe(() => {
      this.changesGetInputs.emit();
    });
  }

  substractQuantityPurcharse(row: any) {
    if (row.quantity > 0) {
      row.quantity--;
    }
    this.calculateTotalAmountPurcharse(row);
  }

  increaseQuantityPurcharse(row: any) {
    row.quantity++;
    this.calculateTotalAmountPurcharse(row);
  }

  calculateTotalAmountPurcharse(row: any) {
    const quantity = row.quantity;
    const unitPurcharsePrice = row.unitPurcharsePrice;

    if (quantity || unitPurcharsePrice) {
      row.totalAmount = (quantity * unitPurcharsePrice).toFixed(2);
    } else {
      row.totalAmount = "0.00";
    }
  }

  //Sale  columns
  showErrorMessage(message: string): void {
    const config: MatSnackBarConfig = {
      duration: 5000,
      panelClass: ["error-snackbar"],
      horizontalPosition: "end",
      verticalPosition: "top",
    };
    this._snackBar.open(message, "X", config);
  }

  decrementQuantitySale(row: any): void {
    if (row.quantity <= 0) {
      this.showErrorMessage("La cantidad no puede ser menor a cero");
      return;
    }
    row.quantity--;
    this.calculateTotalAmountSale(row);
  }

  increaseQuantitySale(row: any): void {
    if (row.quantity >= row.currentStock) {
      this.showErrorMessage("No hay suficiente stock disponible");
      return;
    }
    row.quantity++;
    this.calculateTotalAmountSale(row);
  }

  calculateTotalAmountSale(row: any): void {
    const quantity = row.quantity;
    const unitSalePrice = row.unitSalePrice;

    if (quantity || unitSalePrice) {
      row.totalAmount = (quantity * unitSalePrice).toFixed(2);
    } else {
      row.totalAmount = "0.00";
    }
  }
}
