// src/app/shared/services/signalar-role.service.ts

import { environment } from "src/environments/environment";
import { Injectable, NgZone } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { HubConnectionState } from "@microsoft/signalr"; // Asegúrate de importar esto

@Injectable({
  providedIn: "root",
})
export class SignalarRoleService {
  private hubUrl: string = `${environment.server}roleUpdateHub`;
  public hubConnection!: signalR.HubConnection; // '!' para asegurar que se inicializa en startConnection

  private _rolesUpdated = new BehaviorSubject<string[] | null>(null);
  public rolesUpdated$: Observable<string[] | null> =
    this._rolesUpdated.asObservable();

  // Quitamos _refreshTokenNeeded si AuthService manejará el refresco directamente
  // private _refreshTokenNeeded = new Subject<void>();
  // public refreshTokenNeeded$: Observable<void> =
  //   this._refreshTokenNeeded.asObservable();

  constructor(private ngZone: NgZone) {}

  public startConnection(accessToken: string): Promise<void> {
    // (10.1) Verificación de conexión existente
    if (
      this.hubConnection &&
      this.hubConnection.state !== HubConnectionState.Disconnected // Comprobar si ya no está desconectado
    ) {
      console.warn(
        `SignalR: La conexión ya está en estado ${this.hubConnection.state}. Cerrando para iniciar nueva si no está Connected.`
      );
      // Detener si ya está conectado o en otro estado que no sea "Disconnected"
      if (this.hubConnection.state === HubConnectionState.Connected) {
         this.hubConnection.stop();
      } else {
        // Si está en Connecting, Reconnecting, Disconnecting, etc., simplemente salimos o esperamos.
        // Para este escenario, si ya existe una conexión intentando algo, es mejor dejarla o forzar stop.
        return Promise.resolve(); // O throw new Error('Connection already in progress');
      }
    }

    // (10.2) Construcción de la conexión SignalR
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => accessToken, // (10.3) Provisión del Token JWT
        // Aquí le decimos a SignalR cómo obtener el token de acceso.
        // SignalR lo usará para autenticar la conexión con el servidor.
      })
      .withAutomaticReconnect({
        // (10.4) Configuración de reconexión automática
        nextRetryDelayInMilliseconds: (retryContext) => {
          if (retryContext.elapsedMilliseconds < 60000) {
            return Math.random() * 10000;
          } else {
            console.warn('SignalR: Se detienen los intentos de reconexión automática después de 1 minuto.');
            return null;
          }
        },
      })
      .build();

    // (10.5) Registro de eventos del servidor
    this.registerOnServerEvents(); // Llama al método para configurar los listeners de eventos.

    // (10.6) Inicio de la conexión
    return this.hubConnection
      .start()
      .then(() => {
        console.log("SignalRRoleUpdateService: Conexión establecida.");
        return Promise.resolve(); // Asegurarse de devolver una promesa resuelta
      })
      .catch((err) => {
        console.error(
          "SignalRRoleUpdateService: Error al iniciar la conexión: " + err
        );
        throw err; // Propagar el error para que AuthService lo maneje
      });
  }

  public stopConnection(): Promise<void> {
    if (this.hubConnection && this.hubConnection.state !== HubConnectionState.Disconnected) {
      return this.hubConnection
        .stop()
        .then(() => console.log("SignalRRoleUpdateService: Conexión detenida."))
        .catch((err) =>
          console.error(
            "SignalRRoleUpdateService: Error al detener la conexión: " + err
          )
        );
    }
    return Promise.resolve();
  }

  private registerOnServerEvents(): void {
    // Asegurarse de que hubConnection esté inicializado antes de registrar eventos
    if (!this.hubConnection) {
        console.error('SignalRRoleUpdateService: hubConnection no está inicializado. No se pueden registrar eventos.');
        return;
    }

    this.hubConnection.on("ReceiveRoleUpdate", (roles: string[]) => {
      this.ngZone.run(() => {
        console.log(
          "SignalRRoleUpdateService: Roles actualizados recibidos:",
          roles
        );
        this._rolesUpdated.next(roles);
        // NO _refreshTokenNeeded.next() aquí si AuthService lo maneja directamente.
      });
    });

    this.hubConnection.on(
      "ReceiveTestMessage",
      (user: string, message: string) => {
        this.ngZone.run(() => {
          console.log(
            `SignalRRoleUpdateService (Test): Mensaje de ${user}: ${message}`
          );
        });
      }
    );

    this.hubConnection.onreconnected(() => {
      console.log("SignalRRoleUpdateService: Conexión reestablecida.");
    });

    this.hubConnection.onreconnecting((error) => {
      console.warn("SignalRRoleUpdateService: Reintentando conectar...", error);
    });

    this.hubConnection.onclose((error) => {
      console.error(
        "SignalRRoleUpdateService: Conexión cerrada inesperadamente: " + error
      );
    });
  }

  public sendTestMessage(message: string): Promise<void> {
    if (this.hubConnection && this.hubConnection.state === HubConnectionState.Connected) {
      return this.hubConnection
        .invoke("SendTestMessage", message)
        .catch((err) =>
          console.error(
            "SignalRRoleUpdateService: Error al enviar mensaje de prueba: " +
              err
          )
        );
    } else {
      console.warn(
        "SignalRRoleUpdateService: No se puede enviar mensaje, la conexión no está activa."
      );
      return Promise.resolve();
    }
  }
}