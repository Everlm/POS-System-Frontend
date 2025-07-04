import { Icon } from "@visurel/iconify-angular";

export type NavigationItem =
  | NavigationLink
  | NavigationDropdown
  | NavigationSubheading;

export interface NavigationLink {
  type: "link";
  route: string | any;
  fragment?: string;
  label: string;
  icon?: Icon;
  routerLinkActiveOptions?: { exact: boolean };
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
  roles?: string[];
}

export interface NavigationDropdown {
  type: "dropdown";
  label: string;
  icon?: Icon;
  children: Array<NavigationLink | NavigationDropdown>;
  badge?: {
    value: string;
    bgClass: string;
    textClass: string;
  };
  roles?: string[];
}

export interface NavigationSubheading {
  type: "subheading";
  label: string;
  icon?: Icon;
  children: Array<NavigationLink | NavigationDropdown>;
  roles?: string[];
}
