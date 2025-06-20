import { Injectable, NgZone } from "@angular/core";
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class SignalrAuthService {
  private hubConnection!: signalR.HubConnection;
  private readonly hubUrl = environment.baseUrl + "/authHub";
  private readonly rolesUpdatedSubject = new BehaviorSubject<string | null>(
    null
  );
  rolesUpdated$ = this.rolesUpdatedSubject.asObservable();

  constructor(private ngZone: NgZone) {}

  connect(token: string): void {
    if (this.hubConnection) {
      this.disconnect();
    }

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.registerOnServerEvents();

    this.hubConnection
      .start()
      .then(() => console.log("SignalR conectado correctamente"))
      .catch((err) => console.error("Error al conectar SignalR:", err));
  }

  disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection
        .stop()
        .catch((err) => console.error("Error al desconectar SignalR:", err));
    }
  }

  private registerOnServerEvents(): void {
    this.hubConnection.on("RolesUpdated", (signal: string) => {
      this.ngZone.run(() => {
        console.log("Evento 'RolesUpdated' recibido con email:", signal);
        this.rolesUpdatedSubject.next(signal);
      });
    });

    this.hubConnection.onreconnected(() => {
      console.log("SignalR reconectado");
    });

    this.hubConnection.onclose((error) => {
      console.error("SignalR desconectado", error);
    });
  }

}
