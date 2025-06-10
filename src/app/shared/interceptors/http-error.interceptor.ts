import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NgxSpinnerService } from "ngx-spinner";
import { catchError } from "rxjs/operators";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private _snackBar: MatSnackBar,
    private _spinner: NgxSpinnerService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "Ha ocurrido un error desconocido.";
        let userMessage = "Ocurrió un error inesperado al cargar los datos.";

        switch (error.status) {
          case 0:
            userMessage =
              "No se pudo conectar con el servidor. Por favor, verifica tu conexión o inténtalo más tarde.";
            break;
          case 400: // Bad Request
            userMessage = error.error?.message || "La solicitud es incorrecta.";
            break;
          case 401: // Unauthorized
            userMessage =
              "No estás autorizado para realizar esta acción. Por favor, inicia sesión.";
            // Podrías redirigir al login aquí
            // this.router.navigate(['/login']);
            break;
          case 403: // Forbidden
            userMessage = "No tienes permisos para acceder a este recurso.";
            break;
          case 404: // Not Found
            userMessage = "El recurso solicitado no fue encontrado.";
            break;
          case 500: // Internal Server Error
            userMessage =
              "Error interno del servidor. Por favor, inténtalo de nuevo más tarde.";
            break;
          default:
            // Mensaje genérico para otros códigos de estado
            userMessage = `Error de servidor: ${error.status}.`;
            break;
        }

        if (
          error.error &&
          typeof error.error === "object" &&
          error.error.message
        ) {
          userMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }

        this._snackBar.open(userMessage, "Cerrar", {
          duration: 7000,
          panelClass: ["snackbar-error"],
        });

        return throwError(() => new Error(userMessage));
      })
    );
  }
}
