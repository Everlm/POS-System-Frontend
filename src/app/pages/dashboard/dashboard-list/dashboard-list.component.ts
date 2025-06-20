import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";
import { UpdateUserRequest } from "@shared/models/UpdateUserRequest";
import { SignalrAuthService } from "../../auth/services/signalr-auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "vex-dashboard-list",
  templateUrl: "./dashboard-list.component.html",
  styleUrls: ["./dashboard-list.component.scss"],
})
export class DashboardListComponent implements OnInit {
  testSignalStatus: string = "";
  loadingTestSignal: boolean = false;
  rolesUpdatedEmail: string | null = null;
  private signalrSub!: Subscription;

  constructor(
    private authService: AuthService,
    private signalrAuthService: SignalrAuthService
  ) {}

  ngOnInit(): void {
    const currentUser = this.authService.userToken;

    if (currentUser) {
      this.signalrAuthService.connect(currentUser.token);
    }

    this.signalrSub = this.signalrAuthService.rolesUpdated$.subscribe(
      (message) => {
        if (message) {
          this.rolesUpdatedEmail = message;
          console.log(message);
          
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.signalrSub?.unsubscribe();
  }

  sendTestSignal(): void {
    const currentUser = this.authService.userToken;

    if (!currentUser) {
      this.testSignalStatus = "Error: Usuario no logueado.";
      return;
    }

    const request: UpdateUserRequest = {
      email: "everlm17@gmail.com",
      sendSignalTest: true,
    };

    this.loadingTestSignal = true;
    this.testSignalStatus = "Enviando señal de prueba...";

    this.authService.updateUserRolesAndSendTestSignal(request).subscribe({
      next: (resp) => {
        if (resp.isSuccess) {
          this.testSignalStatus = "Señal enviada correctamente.";
        } else {
          this.testSignalStatus = `Error al enviar señal: ${
            resp.message || "Error desconocido"
          }`;
        }
      },
      error: (err) => {
        this.testSignalStatus = "Error al enviar la señal.";
        console.error(err);
      },
      complete: () => {
        this.loadingTestSignal = false;
      },
    });
  }
}
