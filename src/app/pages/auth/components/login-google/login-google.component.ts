import { Component, OnInit, NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { CredentialResponse, PromptMomentNotification } from "google-one-tap";
import { AuthService } from "../../services/auth.service";
import { environment } from "src/environments/environment";
import { BaseResponse } from "@shared/models/base-api-response.interface";

declare var window: any;
declare var google: any;

@Component({
  selector: "app-login-google",
  templateUrl: "./login-google.component.html",
  styleUrls: ["./login-google.component.scss"],
})
export class LoginGoogleComponent implements OnInit {
  private clientId = environment.clientId;

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
    console.log("Google Sign In Initialized");
  }

  initializeGoogleSignIn() {
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id: this.clientId,
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: false,
      });
      google.accounts.id.renderButton(document.getElementById("buttonGoogle"), {
        theme: "filled_blue",
        type: "standard",
        size: "large",
        text: "continue_with",
        shape: "square",
        width: "300",
      });
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };
  }

  async handleCredentialResponse(response: CredentialResponse) {
    await this.authService
      .loginWithGoogle(response.credential, "Externo")
      .subscribe(
        (resp: BaseResponse) => {
          if (resp.isSuccess) {
            this.ngZone.run(() => {
              this.router.navigate(["/"]);
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
}
