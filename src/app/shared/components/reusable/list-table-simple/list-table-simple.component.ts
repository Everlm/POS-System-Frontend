import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { stagger20ms } from "src/@vex/animations/stagger.animation";
import { fadeInUp400ms } from "src/@vex/animations/fade-in-up.animation";
import { scaleFadeIn400ms } from "src/@vex/animations/scale-fade-in.animation";
import { MatPaginator, MatPaginatorIntl } from "@angular/material/paginator";
import { getEsPaginatorIntl } from "@shared/paginator-intl/es-paginator-intl";
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from "@angular/material/form-field";
import { TableColumnSimple } from "@shared/models/list-table-simple.interface";
import { MatTableDataSource } from "@angular/material/table";
import { IconsService } from "@shared/services/icons.service";
import { MatSort } from "@angular/material/sort";
import icRadioButtonChecked from "@iconify/icons-ic/twotone-radio-button-checked";
import icRadioButtonUnchecked from "@iconify/icons-ic/twotone-radio-button-unchecked";

@Component({
  selector: "app-list-table-simple",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./list-table-simple.component.html",
  styleUrls: ["./list-table-simple.component.scss"],
  animations: [stagger20ms, fadeInUp400ms, scaleFadeIn400ms],
  providers: [
    { provide: MatPaginatorIntl, useValue: getEsPaginatorIntl() },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "standard" } as MatFormFieldDefaultOptions,
    },
  ],
})
export class ListTableSimpleComponent<T> implements OnInit, AfterViewInit {
  @Input() columns: TableColumnSimple<T>[];
  @Input() data: any;
  @Output() rowClick = new EventEmitter<T>();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource: MatTableDataSource<T>;
  visibleColumns: Array<keyof T | string>;

  paginatorOptions = {
    pageSizeOptions: [5, 10, 20],
    pageSize: [5],
    pageLength: 0,
  };

  icSearch = IconsService.prototype.getIcon("icSearch");

  constructor() {}

  ngOnInit(): void {
    if (this.data) {
      this.visibleColumns = this.columns
        .filter((column) => column.visible)
        .map((column) => column.property);

      this.dataSource = new MatTableDataSource(this.data);
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
