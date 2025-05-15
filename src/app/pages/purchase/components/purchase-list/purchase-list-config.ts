import { TableColumns } from "@shared/models/list-table.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import {
  ProductDetailResponse,
  PurchaseResponse,
} from "../../models/purchase-response.interface";
import { ProductResponse } from "src/app/pages/product/models/product-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "Provider",
    value: 1,
    placeholder: "Search for Provider",
    validation: [GenericValidators.defaultName],
    validation_desc: "Only letters are allowed",
    icon: "icName",
  },
];

const productSearchOptions: SearchOptions[] = [
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

const productTableColumns: TableColumns<ProductDetailResponse>[] = [
  {
    label: "",
    cssLabel: ["font-bold", "text-xxs"],
    property: "image",
    cssProperty: ["font-semibold", "text-xs", "text-left"],
    type: "image",
    sticky: true,
    sort: false,
    sortProperty: "image",
    visible: true,
    download: true,
  },
  {
    label: "Code",
    cssLabel: ["font-bold", "text-xxs", "th-center"],
    property: "code",
    cssProperty: ["font-semibold", "text-xs", "td-center"],
    type: "textUppercase",
    sticky: false,
    sort: false,
    sortProperty: "code",
    visible: true,
    download: true,
  },
  {
    label: "Name",
    cssLabel: ["font-bold", "text-xxs", "th-center"],
    property: "name",
    cssProperty: ["font-semibold", "text-xs", "td-center"],
    subProperty: "category",
    cssSubProperty: ["text-xxs", "text-am-gray", "uppercase", "text-left"],
    type: "text",
    sticky: false,
    sort: false,
    sortProperty: "name",
    visible: true,
    download: true,
  },
  {
    label: "Quantity",
    cssLabel: ["font-bold", "text-xxs", "th-center"],
    property: "quantity",
    cssProperty: ["font-semibold", "text-xs", "td-center"],
    type: "quantityPurchase",
    sticky: false,
    sort: false,
    sortProperty: "quantity",
    visible: true,
    download: true,
  },
  {
    label: "Unit price",
    cssLabel: ["font-bold", "text-xxs", "th-center"],
    property: "unitPurcharsePrice",
    cssProperty: ["font-semibold", "text-xs", "td-center"],
    type: "unitPurchasePrice",
    sticky: false,
    sort: false,
    sortProperty: "unitPurcharsePrice",
    visible: true,
    download: true,
  },
  {
    label: "Total",
    cssLabel: ["font-bold", "text-xxs", "th-center"],
    property: "totalAmount",
    cssProperty: ["font-semibold", "text-xs", "td-center"],
    type: "totalAmount",
    sticky: false,
    sort: false,
    sortProperty: "totalAmount",
    visible: true,
    download: true,
  },
  {
    label: "",
    cssLabel: [],
    property: "icAdd",
    cssProperty: [],
    type: "icon",
    action: "addDetail",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
];

const tableColumns: TableColumns<PurchaseResponse>[] = [
  {
    label: "Provider",
    cssLabel: ["font-bold", "text-sm"],
    property: "provider",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "textUppercase",
    sticky: true,
    sort: true,
    sortProperty: "provider",
    visible: true,
    download: true,
  },
  {
    label: "Warehouse",
    cssLabel: ["font-bold", "text-sm"],
    property: "warehouse",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "textUppercase",
    sticky: false,
    sort: true,
    sortProperty: "warehouse",
    visible: true,
    download: true,
  },
  {
    label: "Total Amount",
    cssLabel: ["font-bold", "text-sm"],
    property: "totalAmount",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "currency",
    sticky: false,
    sort: true,
    sortProperty: "totalAmount",
    visible: true,
    download: true,
  },
  {
    label: "Date Of Purchase",
    cssLabel: ["font-bold", "text-sm"],
    property: "dateOfPurchase",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "datetime",
    sticky: false,
    sort: true,
    sortProperty: "dateOfPurchase",
    visible: true,
    download: true,
  },

  {
    label: "",
    cssLabel: [],
    property: "icViewDetail",
    cssProperty: [],
    type: "icon",
    action: "viewDetail",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
  {
    label: "",
    cssLabel: [],
    property: "icCancel",
    cssProperty: [],
    type: "icon",
    action: "cancel",
    sticky: false,
    sort: false,
    visible: true,
    download: false,
  },
];

const filters = {
  numFilter: 0,
  textFilter: "",
  startDate: "",
  endDate: "",
  refresh: false,
};

const resetFilters = {
  numFilter: 0,
  textFilter: "",
  startDate: "",
  endDate: "",
  refresh: false,
};

const getInputs: string = "";

export const PurchaseComponentSettings = {
  icProcess: IconsService.prototype.getIcon("icProcess"),
  searchOptions,
  productSearchOptions,
  tableColumns,
  productTableColumns,
  filters,
  resetFilters,
  getInputs,
  initialSort: "Id",
  initialSortAdress: "desc",
  fileName: "Listado-de-compras",
};
