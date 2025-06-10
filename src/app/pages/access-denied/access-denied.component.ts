import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";

@Component({
  selector: "app-access-denied",
  templateUrl: "./access-denied.component.html",
  styleUrls: ["./access-denied.component.scss"],
})
export class AccessDeniedComponent implements OnInit {
  constructor(private _location: Location) {}

  ngOnInit(): void {}

  goBack(): void {
    this._location.back();
  }
}
