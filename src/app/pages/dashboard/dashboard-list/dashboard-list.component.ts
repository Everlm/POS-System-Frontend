import { Component, OnDestroy, OnInit } from "@angular/core";
import { AuthService } from "../../auth/services/auth.service";
import { SignalarRoleService } from "@shared/services/signalar-role.service";
import { Subscription } from 'rxjs/internal/Subscription';
import { UpdateUserRequest } from "@shared/models/UpdateUserRequest";
import { HttpErrorResponse } from "@angular/common/http";

@Component({
  selector: "vex-dashboard-list",
  templateUrl: "./dashboard-list.component.html",
  styleUrls: ["./dashboard-list.component.scss"],
})
export class DashboardListComponent implements OnInit, OnDestroy {
  signalTestMessage: string | null = null;
  signalTestError: string | null = null;
  currentRoles: string[] | null = null; // Para mostrar los roles recibidos
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private signalRRoleUpdateService: SignalarRoleService // Inyecta el servicio SignalR
  ) {}

  ngOnInit(): void {
    // Suscribirse a las actualizaciones de roles del servicio SignalR
    this.subscriptions.add(
      this.signalRRoleUpdateService.rolesUpdated$.subscribe((roles) => {
        if (roles) {
          this.currentRoles = roles;
          console.log(
            "DashboardComponent: Roles actualizados recibidos via SignalR:",
            roles
          );
          this.signalTestMessage = `¡Roles actualizados recibidos! (${roles.join(
            ", "
          )})`;
          this.signalTestError = null;
        } else {
          this.currentRoles = null;
        }
      })
    );

    // Opcional: Suscribirse a la notificación de refresco de token si el AppComponent no lo hace
    // Aunque lo ideal es que lo haga un servicio o componente global como AppComponent.
    // Si ya lo haces en AppComponent, puedes omitir esta suscripción aquí.
    // this.subscriptions.add(
    //   this.signalRRoleUpdateService.refreshTokenNeeded$.subscribe(() => {
    //     console.log(
    //       "DashboardComponent: Notificación de refreshTokenNeeded de SignalR. Intentando refrescar token..."
    //     );
    //     // Llama al refreshToken del AuthService.
    //     // Es buena práctica tener un mecanismo global para esto.
    //     // Por ejemplo, en el AppComponent o en un interceptor Http.
    //     this.authService.refreshToken().subscribe({
    //       next: (resp) => {
    //         if (resp.isSuccess) {
    //           console.log("DashboardComponent: Token refrescado con éxito.");
    //         } else {
    //           console.error(
    //             "DashboardComponent: Fallo al refrescar el token:",
    //             resp.message
    //           );
    //         }
    //       },
    //       error: (err) => {
    //         console.error(
    //           "DashboardComponent: Error al refrescar el token:",
    //           err
    //         );
    //       },
    //     });
    //   })
    // );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe(); // Desuscribirse para evitar fugas de memoria
  }

  sendSignalRTest(): void {
    this.signalTestMessage = null;
    this.signalTestError = null;

    const currentUser = this.authService.userToken; // Obtén el usuario actual del AuthService

    if (!currentUser || !currentUser.token) {
      this.signalTestError =
        "No hay usuario logeado para enviar la señal de prueba.";
      console.error(this.signalTestError);
      return;
    }

    // Prepara el request DTO con la bandera de prueba
    const request: UpdateUserRequest = {
      email: "everlm17@gmail.com", // Asumiendo que el email está en tu LoginResponse
      roles: [], // Puedes dejarlo vacío o con roles dummy, no importa para la simulación
      sendSignalTest: true, // ¡Activamos la bandera de prueba!
    };

    // Llama a tu endpoint de backend que ejecuta UpdateUserAsync
    // Asegúrate de tener un método en tu AuthService o UserService que llame a este endpoint.
    // Si tu AuthService no tiene un método para UpdateUser, podrías añadirlo o usar otro servicio.
    // Por simplicidad, aquí asumo que podrías extender AuthService para esto o tener un UserService.
    // Aquí hago una llamada ficticia, reemplaza esto con tu llamada real a la API.
    this.authService.updateUserRolesAndSendTestSignal(request).subscribe({
      // <--- NECESITAS IMPLEMENTAR ESTE MÉTODO EN TU AUTHSERVICE
      next: (response) => {
        if (response.isSuccess) {
          console.log(
            "DashboardComponent: Solicitud de señal de prueba enviada al backend. Esperando notificación SignalR..."
          );
          this.signalTestMessage =
            "Solicitud enviada al backend. Esperando la señal en tiempo real...";
        } else {
          this.signalTestError = `Error al enviar solicitud de prueba: ${response.message}`;
          console.error("DashboardComponent:", this.signalTestError);
        }
      },
      error: (error: HttpErrorResponse) => {
        this.signalTestError = `Error de red o API al enviar solicitud: ${
          error.message || error.statusText
        }`;
        console.error("DashboardComponent:", error);
      },
    });
  }
}
