import { Injectable } from "@angular/core";
import icEdit from "@iconify/icons-ic/round-edit";
import icDelete from "@iconify/icons-ic/round-delete";
import icArrowDropDown from "@iconify/icons-ic/round-arrow-drop-down";
import icSearch from "@iconify/icons-ic/round-search";
import icClose from "@iconify/icons-ic/round-close";
import icName from "@iconify/icons-ic/round-badge";
import icDescription from "@iconify/icons-ic/round-description";
import icVisibility from "@iconify/icons-ic/twotone-visibility";
import icVisibilityOff from "@iconify/icons-ic/twotone-visibility-off";
import iconEmail from "@iconify/icons-ic/twotone-group";
import icViewHeadLine from "@iconify/icons-ic/twotone-view-headline";
import icLabel from "@iconify/icons-ic/twotone-label";
import iconProvider from "@iconify/icons-ic/twotone-group";
import icCategory from "@iconify/icons-ic/twotone-category";
import icDashboard from "@iconify/icons-ic/twotone-dashboard";

@Injectable({
  providedIn: "root",
})
export class IconsService {
  getIcon(icon: string) {
    if (icon == "icEdit") {
      return icEdit;
    }

    if (icon == "icDelete") {
      return icDelete;
    }

    if (icon == "icArrowDropDown") {
      return icArrowDropDown;
    }

    if (icon == "icSearch") {
      return icSearch;
    }

    if (icon == "icClose") {
      return icClose;
    }

    if (icon == "icName") {
      return icName;
    }

    if (icon == "icDescription") {
      return icDescription;
    }

    if (icon == "icVisibility") {
      return icVisibility;
    }

    if (icon == "icVisibilityOff") {
      return icVisibilityOff;
    }
    if (icon == "iconEmail") {
      return iconEmail;
    }
    if (icon == "icViewHeadLine") {
      return icViewHeadLine;
    }
    if (icon == "icLabel") {
      return icLabel;
    }
    if (icon == "iconProvider") {
      return iconProvider;
    }
    if (icon == "icCategory") {
      return icCategory;
    }
    if (icon == "icDashboard") {
      return icDashboard;
    }
  }
}
