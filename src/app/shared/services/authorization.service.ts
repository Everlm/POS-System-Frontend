import { Injectable } from "@angular/core";
import { jwtDecode } from "jwt-decode";
import { AuthService } from "src/app/pages/auth/services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthorizationService {
  private readonly ROLE_CLAIM_KEY =
    "http://schemas.microsoft.com/ws/2008/06/identity/claims/role";

  constructor(private authService: AuthService) {}

  private getDecodedToken(): any | null {
    const token = this.authService.userToken?.token;
    if (!token) {
      return null;
    }
    try {
      return jwtDecode(token);
    } catch (Error) {
      console.error(
        "Error decodificando el token JWT en AuthorizationService:",
        Error
      );
      return null;
    }
  }

  /**
   * Obtiene los roles del usuario del token JWT.
   * @returns Un array de strings con los roles del usuario.
   */
  getUserRoles(): string[] {
    const decodedToken = this.getDecodedToken();
    if (!decodedToken) {
      return [];
    }

    const roles = decodedToken[this.ROLE_CLAIM_KEY];

    if (Array.isArray(roles)) {
      return roles;
    } else if (typeof roles === "string") {
      return [roles];
    }
    return [];
  }

  /**
   * Verifica si el usuario actual tiene al menos uno de los roles requeridos.
   * @param requiredRoles Un array de roles (cadenas) a verificar.
   * @returns `true` si el usuario tiene al menos uno de los roles, `false` en caso contrario.
   */
  hasRole(requiredRoles: string[]): boolean {
    if (!this.authService.isAuthenticated()) {
      return false; // No autenticado, no tiene roles
    }
    const userRoles = this.getUserRoles();
    // Verifica si ALGUNO de los roles del usuario está en la lista de roles requeridos
    return requiredRoles.some((role) => userRoles.includes(role));
  }

  // --- Lógica para futuros Permisos (si decides implementarlos) ---

  /**
   * Obtiene los permisos del usuario del token JWT (si los añades como claims).
   * @returns Un array de strings con los permisos del usuario.
   */
  // getUserPermissions(): string[] {
  //   const decodedToken = this.getDecodedToken();
  //   if (!decodedToken) {
  //     return [];
  //   }
  //   const permissions = decodedToken[this.PERMISSION_CLAIM_KEY];
  //   if (Array.isArray(permissions)) {
  //     return permissions;
  //   } else if (typeof permissions === 'string') {
  //     return [permissions];
  //   }
  //   return [];
  // }

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   * @param requiredPermission La cadena del permiso a verificar.
   * @returns `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  // hasPermission(requiredPermission: string): boolean {
  //   if (!this.authService.isAuthenticated()) {
  //     return false;
  //   }
  //   const userPermissions = this.getUserPermissions();
  //   return userPermissions.includes(requiredPermission);
  // }

  /**
   * Verifica si el usuario actual tiene todos los permisos requeridos.
   * @param requiredPermissions Un array de permisos a verificar.
   * @returns `true` si el usuario tiene TODOS los permisos, `false` en caso contrario.
   */
  // hasAllPermissions(requiredPermissions: string[]): boolean {
  //     if (!this.authService.isAuthenticated()) {
  //         return false;
  //     }
  //     const userPermissions = this.getUserPermissions();
  //     return requiredPermissions.every(perm => userPermissions.includes(perm));
  // }
}
