import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import {
  MomentDateModule,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { MY_DATE_FORMATS } from "@shared/functions/date-format";
import { Moment } from "moment";
import moment from "moment";
import { FormControl, FormGroup } from "@angular/forms";
import { IconsService } from "@shared/services/icons.service";
import { MatDatepickerInputEvent } from "@angular/material/datepicker";

@Component({
  selector: "app-filter-date-range-ymd",
  standalone: true,
  imports: [SharedModule, MomentDateModule],
  templateUrl: "./filter-date-range-ymd.component.html",
  styleUrls: ["./filter-date-range-ymd.component.scss"],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
})
export class FilterDateRangeYmdComponent implements OnInit, OnChanges {
  @Input() start: string;
  @Input() end: string;
  @Input() maxDate: Moment = moment();

  @Output() rangeDate = new EventEmitter<{
    startDate: string;
    endDate: string;
  }>();

  range = new FormGroup({
    startDate: new FormControl<Moment | null>(null),
    endDate: new FormControl<Moment | null>(null),
  });

  icToday = IconsService.prototype.getIcon("icToday");

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["start"] || changes["end"]) {
      this.range.patchValue({
        startDate: this.start ? moment(this.start) : null,
        endDate: this.end ? moment(this.end) : null,
      });
    }
  }

  addEvent(event: MatDatepickerInputEvent<Date>): void {
    if (event.value) {
      this.emitDates();
    }
  }

  emitDates(): void {
    const startDateControl = this.range.get("startDate")?.value;
    const endDateControl = this.range.get("endDate")?.value;

    if (startDateControl && endDateControl) {
      this.rangeDate.emit({
        startDate: moment(startDateControl).format("YYYY-MM-DD"),
        endDate: moment(endDateControl).format("YYYY-MM-DD"),
      });
    }
  }
}
