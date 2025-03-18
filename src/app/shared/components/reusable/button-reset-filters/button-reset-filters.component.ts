import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SharedModule } from "@shared/shared.module";
import { IconsService } from "@shared/services/icons.service";

@Component({
  selector: "app-button-reset-filters",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./button-reset-filters.component.html",
  styleUrls: ["./button-reset-filters.component.scss"],
})
export class ButtonResetFiltersComponent implements OnInit {
  @Output() buttonClick = new EventEmitter<void>();
  icRefresh = IconsService.prototype.getIcon("icRefresh");

  ngOnInit(): void {}

  emitClick() {
    this.buttonClick.emit();
  }
}
