import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { ProductResponse } from "../../models/product-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "Name",
    value: 1,
    placeholder: "Search for name",
    validation: [GenericValidators.defaultName],
    validation_desc: "Only letters are allowed",
    icon: "icName",
  },
  {
    label: "Code",
    value: 2,
    placeholder: "Search for code",
    validation: [GenericValidators.alphanumeric],
    validation_desc: "Only letters are allowed",
    icon: "icCode",
  },
];

const menuItems: MenuItems[] = [
  {
    type: "link",
    id: "all",
    icon: IconsService.prototype.getIcon("icViewHeadLine"),
    label: "All",
  },
  {
    type: "link",
    id: "Active",
    value: 1,
    icon: IconsService.prototype.getIcon("icLabel"),
    label: "Active",
    class: {
      icon: "text-green",
    },
  },
  {
    type: "link",
    id: "Inactive",
    value: 0,
    icon: IconsService.prototype.getIcon("icLabel"),
    label: "Inactive",
    class: {
      icon: "text-gray",
    },
  },
];

const tableColumns: TableColumns<ProductResponse>[] = [
  {
    label: "",
    cssLabel: ["font-bold", "text-sm"],
    property: "image",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "image",
    sticky: true,
    sort: true,
    sortProperty: "image",
    visible: true,
    download: true,
  },
  {
    label: "Code",
    cssLabel: ["font-bold", "text-sm"],
    property: "code",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "textUppercase",
    sticky: true,
    sort: true,
    sortProperty: "code",
    visible: true,
    download: true,
  },
  {
    label: "Name",
    cssLabel: ["font-bold", "text-sm"],
    property: "name",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: true,
    sort: true,
    sortProperty: "name",
    visible: true,
    download: true,
  },
  {
    label: "Category",
    cssLabel: ["font-bold", "text-sm"],
    property: "category",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: true,
    sort: true,
    sortProperty: "category",
    visible: true,
    download: true,
  },
  {
    label: "Min Stock",
    cssLabel: ["font-bold", "text-sm"],
    property: "stockMin",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "number",
    sticky: true,
    sort: true,
    sortProperty: "stockMin",
    visible: true,
    download: true,
  },
  {
    label: "Max Stock",
    cssLabel: ["font-bold", "text-sm"],
    property: "stockMax",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "number",
    sticky: true,
    sort: true,
    sortProperty: "stockMax",
    visible: true,
    download: true,
  },
  {
    label: "Price unit",
    cssLabel: ["font-bold", "text-sm"],
    property: "unitSalePrice",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "currency",
    sticky: true,
    sort: true,
    sortProperty: "unitSalePrice",
    visible: true,
    download: true,
  },
  {
    label: "State",
    cssLabel: ["font-bold", "text-sm"],
    property: "stateProduct",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "badge",
    sticky: false,
    sort: false,
    visible: true,
    download: true,
  },
  {
    label: "",
    cssLabel: [],
    property: "icView",
    cssProperty: [],
    type: "icon",
    action: "view",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
  {
    label: "",
    cssLabel: [],
    property: "icEdit",
    cssProperty: [],
    type: "icon",
    action: "edit",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
  {
    label: "",
    cssLabel: [],
    property: "icDelete",
    cssProperty: [],
    type: "icon",
    action: "delete",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
];

const filters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  refresh: false,
};

const resetFilters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  refresh: false,
};

const getInputs: string = "";

export const ProductComponentSettings = {
  icProduct: IconsService.prototype.getIcon("icProduct"),
  searchOptions,
  menuItems,
  tableColumns,
  filters,
  resetFilters,
  getInputs,
  initialSort: "Id",
  initialSortAdress: "desc",
  fileName: "Listado-de-productos",
};
