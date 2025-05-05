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
import iconCloudDowload from "@iconify/icons-ic/twotone-cloud-download";
import icToday from "@iconify/icons-ic/twotone-today";
import icRefresh from "@iconify/icons-ic/twotone-restart-alt";
import icWarehouse from "@iconify/icons-ic/twotone-widgets";
import icProduct from "@iconify/icons-ic/twotone-inventory-2";
import icManage from "@iconify/icons-ic/twotone-article";
import icCode from "@iconify/icons-ic/twotone-barcode";
import icUpload from "@iconify/icons-ic/twotone-upload-file";
import iconCustomer from "@iconify/icons-ic/twotone-supervisor-account"

@Injectable({
  providedIn: "root",
})
export class IconsService {
  getIcon(icon: string) {
    if (icon == "icUpload") {
      return icUpload;
    }
    if (icon == "iconCustomer") {
      return iconCustomer;
    }
    if (icon == "icCode") {
      return icCode;
    }
    if (icon == "icProduct") {
      return icProduct;
    }
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
    if (icon == "iconCloudDowload") {
      return iconCloudDowload;
    }
    if (icon == "icToday") {
      return icToday;
    }
    if (icon == "icRefresh") {
      return icRefresh;
    }
    if (icon == "icWarehouse") {
      return icWarehouse;
    }
    if (icon == "icManage") {
      return icManage;
    }
  }
}
