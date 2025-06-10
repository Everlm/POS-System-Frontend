import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { ROUTES } from "@shared/functions/variables";
import { AuthorizationService } from "@shared/services/authorization.service";
import { Observable } from "rxjs";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private authorizationService: AuthorizationService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const expectedRoles = route.data["roles"] as string[];

    if (!this.authService.isAuthenticated()) {
      console.warn("RoleGuard: Usuario no autenticado. Redirigiendo a login.");
      this.router.navigate(["/" + ROUTES.LOGIN]);
      return false;
    }

    if (!expectedRoles || expectedRoles.length === 0) {
      return true; // Permite acceso si está autenticado y no hay roles específicos
    }

    if (this.authorizationService.hasRole(expectedRoles)) {
      return true;
    } else {
      console.warn(
        "RoleGuard: Usuario autenticado pero sin rol(es) requerido(s). Redirigiendo a acceso denegado."
      );
      console.error("acceso denegado");
      this.router.navigate(["/" + ROUTES.ACCESS_DENIED]);
      return false;
    }
  }
}
