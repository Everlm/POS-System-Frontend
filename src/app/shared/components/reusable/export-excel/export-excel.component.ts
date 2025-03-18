import { Component, Input, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IconsService } from "@shared/services/icons.service";
import { DownloadXslxService } from "@shared/services/download-xslx.service";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import { IconsModule } from "@shared/import-modules/icons.module";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-export-excel",
  standalone: true,
  imports: [CommonModule, IconsModule, MatButtonModule, MatTooltipModule],
  templateUrl: "./export-excel.component.html",
  styleUrls: ["./export-excel.component.scss"],
})
export class ExportExcelComponent implements OnInit {
  iconCloudDowload = IconsService.prototype.getIcon("iconCloudDowload");

  @Input() url: string = null;
  @Input() getInputs: string = null;
  @Input() filename: string = null;

  infoTooltip = "Descargar resultados en formato Excel";

  constructor(
    public _downloadExcelService: DownloadXslxService,
    private _spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  download() {
    Swal.fire({
      title: "Sure",
      text: "Download excel archive",
      icon: "warning",
      showCancelButton: true,
      focusCancel: true,
      confirmButtonColor: "#1D201D",
      cancelButtonColor: "#5DAD32",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
      width: 420,
    }).then((result) => {
      if (result.isConfirmed) {
        this.executeDownload();
      }
    });
  }
  
  executeDownload() {
    this._spinner.show();

    this._downloadExcelService
      .executeDownload(this.url + this.getInputs)
      .subscribe({
        next: (excelData: Blob) => {
          const fileName = this.filename;
          const blobUrl = URL.createObjectURL(excelData);
          const downloadLink = document.createElement("a");

          downloadLink.href = blobUrl;
          downloadLink.download = fileName;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          URL.revokeObjectURL(blobUrl);

          this._spinner.hide();
        },
        error: (err) => {
          console.error("Error al descargar el archivo:", err);
          this._spinner.hide();
        },
      });
  }
}
