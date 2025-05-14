import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const user = this.authService.userToken;

    // if (user) {
    //   return true;
    // }
    if (user && this.authService.isTokenValid()) {
      return true;
    }

    this.authService.logout(); // Limpia token y cualquier info de sesión
    return this.router.createUrlTree(["/login"]);
    // this.router.navigate(["/login"]);
    // return false;
  }

  // canActivate(): boolean | UrlTree {
  //   if (this.authService.userToken && this.authService.isTokenValid()) {
  //     return true;
  //   }
  //   this.authService.logout();
  //   return this.router.createUrlTree(["/login"]);
  // }
}
