import { TableColumns } from "@shared/models/list-table.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { GenericValidators } from "@shared/validators/generic-validators";
import { SaleResponse } from "../../models/sale-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "Voucher Doument",
    value: 1,
    placeholder: "Search for Voucher Document",
    validation: [GenericValidators.alphanumeric],
    validation_desc: "Only letters are allowed",
    icon: "icName",
  },
];

const tableColumns: TableColumns<SaleResponse>[] = [
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
    property: "icInvoice",
    cssProperty: [],
    type: "icon",
    action: "invoice",
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
