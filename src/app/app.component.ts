import { Component, Inject, LOCALE_ID, Renderer2 } from "@angular/core";
import { ConfigService } from "../@vex/services/config.service";
import { Settings } from "luxon";
import { DOCUMENT } from "@angular/common";
import { Platform } from "@angular/cdk/platform";
import { NavigationService } from "../@vex/services/navigation.service";

import { ActivatedRoute } from "@angular/router";
import { filter, map } from "rxjs/operators";
import { coerceBooleanProperty } from "@angular/cdk/coercion";
import { Style, StyleService } from "../@vex/services/style.service";
import { ConfigName } from "../@vex/interfaces/config-name.model";
import { IconsService } from "@shared/services/icons.service";
import { AppRoles } from "@shared/models/AppRoles";
import {
  NavigationDropdown,
  NavigationItem,
  NavigationLink,
  NavigationSubheading,
} from "src/@vex/interfaces/navigation-item.interface";
import { AuthorizationService } from "@shared/services/authorization.service";
import { AuthService } from "./pages/auth/services/auth.service";

@Component({
  selector: "vex-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "vex";
  private readonly linkItemType = "link";
  private readonly dropdownItemType = "dropdown";
  private readonly subheadingItemType = "subheading";
  private readonly roles = "roles";

  constructor(
    private configService: ConfigService,
    private styleService: StyleService,
    private renderer: Renderer2,
    private platform: Platform,
    @Inject(DOCUMENT) private document: Document,
    @Inject(LOCALE_ID) private localeId: string,
    private route: ActivatedRoute,
    private navigationService: NavigationService,
    private _authorizationService: AuthorizationService,
    private _authService: AuthService
  ) {
    this._initializeLocalization();
    this._applyPlatformSpecificClasses();
    this._configureSidenav();
    this._subscribeToRouteQueryParams();
    this._setupNavigation();
  }

  private _initializeLocalization(): void {
    Settings.defaultLocale = this.localeId;
  }

  private _applyPlatformSpecificClasses(): void {
    if (this.platform.BLINK) {
      this.renderer.addClass(this.document.body, "is-blink");
    }
  }

  private _configureSidenav(): void {
    this.configService.updateConfig({
      sidenav: {
        title: "POS",
        imageUrl: "/assets/img/demo/logo.svg",
        showCollapsePin: true,
      },
    });
  }

  private _subscribeToRouteQueryParams(): void {
    this.route.queryParamMap
      .pipe(
        map(
          (queryParamMap) =>
            queryParamMap.has("rtl") &&
            coerceBooleanProperty(queryParamMap.get("rtl"))
        )
      )
      .subscribe((isRtl) => {
        this.document.body.dir = isRtl ? "rtl" : "ltr";
        this.configService.updateConfig({
          rtl: isRtl,
        });
      });

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("layout")))
      .subscribe((queryParamMap) =>
        this.configService.setConfig(queryParamMap.get("layout") as ConfigName)
      );

    this.route.queryParamMap
      .pipe(filter((queryParamMap) => queryParamMap.has("style")))
      .subscribe((queryParamMap) =>
        this.styleService.setStyle(queryParamMap.get("style") as Style)
      );
  }

  private _setupNavigation(): void {
    const allNavigationItems: NavigationItem[] = [
      {
        type: "link",
        label: "Statistics",
        route: "estadisticas",
        icon: IconsService.prototype.getIcon("icDashboard"),
      },
      {
        type: "link",
        label: "Warehouses",
        route: "warehouses",
        icon: IconsService.prototype.getIcon("icWarehouse"),
        roles: [AppRoles.Admin],
      },
      {
        type: "dropdown",
        label: "Catalog",
        icon: IconsService.prototype.getIcon("icManage"),
        roles: [AppRoles.Admin],
        children: [
          {
            type: "link",
            label: "Categories",
            route: "categories",
            roles: [AppRoles.Admin],
          },
          {
            type: "link",
            label: "Products",
            route: "products",
          },
        ],
      },
      {
        type: "link",
        label: "Providers",
        route: "providers",
        icon: IconsService.prototype.getIcon("iconProvider"),
      },
      {
        type: "link",
        label: "Customer",
        route: "customer",
        icon: IconsService.prototype.getIcon("iconCustomer"),
      },
      {
        type: "dropdown",
        label: "Process",
        icon: IconsService.prototype.getIcon("icProcess"),
        children: [
          {
            type: "link",
            label: "Purchase",
            route: "process-purchase",
          },
          {
            type: "link",
            label: "Sale",
            route: "process-sale",
          },
        ],
      },
    ];

    this.navigationService.items =
      this.filterNavigationItemsByRole(allNavigationItems);
  }

  /**
   * Verifica si un ítem de navegación tiene roles requeridos y si el usuario actual
   * tiene al menos uno de esos roles.
   *
   * @param item El ítem de navegación a verificar.
   * @returns true si el usuario tiene al menos uno de los roles requeridos, false en caso contrario.
   */
  private _itemHasRequiredRoles(
    item: NavigationLink | NavigationDropdown
  ): boolean {
    // Si el ítem no tiene la propiedad 'roles' o 'roles' es un array vacío, se considera que no hay restricciones.
    if (!(this.roles in item) || !item.roles || item.roles.length === 0) {
      return true;
    }
    // Si tiene roles, verifica si el usuario tiene al menos uno de ellos.
    return this._authorizationService.hasRole(item.roles);
  }

  /**
   * Filtra recursivamente un array de ítems de navegación (links, dropdowns y subheadings)
   * basándose en la autenticación del usuario y la autorización por roles.
   *
   * @param items El array de ítems de navegación a filtrar.
   * @returns Un array de ítems de navegación (solo links y dropdowns) que el usuario actual está autorizado a ver.
   */
  private filterNavigationItemsByRole(
    items: NavigationItem[]
  ): (NavigationLink | NavigationDropdown)[] {
    // Si el usuario no está autenticado, no se muestra ningún ítem de navegación principal.
    if (!this._authService.isAuthenticated()) {
      return [];
    }

    const filteredItems: (NavigationLink | NavigationDropdown)[] = [];

    for (const item of items) {
      // Procesar Links y Dropdowns
      if (item.type === this.linkItemType) {
        const linkItem = item as NavigationLink;
        if (this._itemHasRequiredRoles(linkItem)) {
          // Usar la función auxiliar
          filteredItems.push(linkItem);
        }
      } else if (item.type === this.dropdownItemType) {
        const dropdownItem = item as NavigationDropdown;

        // Filtrar recursivamente los hijos del dropdown
        dropdownItem.children = this.filterNavigationItemsByRole(
          dropdownItem.children
        ) as (NavigationLink | NavigationDropdown)[];

        // Incluir el dropdown si tiene hijos visibles Y/O si el dropdown en sí mismo
        // cumple con los requisitos de roles (lo que permitiría un dropdown vacío pero accesible si es el caso).
        if (
          dropdownItem.children.length > 0 ||
          this._itemHasRequiredRoles(dropdownItem)
        ) {
          filteredItems.push(dropdownItem);
        }
      }
      // Manejar Subheadings: Estos no se incluyen directamente en el array final de ítems.
      // Sus hijos válidos son "aplanados" y añadidos a la lista principal.
      else if (item.type === this.subheadingItemType) {
        const subheadingItem = item as NavigationSubheading;
        if (subheadingItem.children) {
          // Recursivamente filtra los hijos de la cabecera y añade directamente
          // a la lista principal los que el usuario tiene permitido ver.
          filteredItems.push(
            ...this.filterNavigationItemsByRole(subheadingItem.children)
          );
        }
      }
    }
    return filteredItems;
  }
}
