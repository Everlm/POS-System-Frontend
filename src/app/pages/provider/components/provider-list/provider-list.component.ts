import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { CustomTitleService } from "@shared/services/custom-title.service";
import { fadeInRight400ms } from "src/@vex/animations/fade-in-right.animation";
import { stagger40ms } from "src/@vex/animations/stagger.animation";
import { ProviderService } from "../../services/provider.service";
import { ProviderComponentSettings } from "./provider-list-config";
import { FiltersBox } from "@shared/models/search-options.interface";
import { scaleIn400ms } from "src/@vex/animations/scale-in.animation";

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
    public _providerService: ProviderService
  ) {
    customTitle.set("Proveedores");
  }

  ngOnInit(): void {
    this.component = ProviderComponentSettings;
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

  formatgetInputs() {
    let str = "";

    if (this.component.filters.textFilter != null) {
      str += `&numFilter=${this.component.filters.numFilter}
      &textFilter=${this.component.filters.textFilter}`;
    }

    if (this.component.filters.stateFilter != null) {
      str += `&stateFilter=${this.component.filters.stateFilter}`;
    }

    this.component.getInputs = str;
  }
}
