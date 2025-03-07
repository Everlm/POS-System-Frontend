import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { ProviderResponse } from "../../models/provider-response.interface";

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
    label: "Email",
    value: 1,
    placeholder: "Search for email",
    validation: [GenericValidators.emailValidation],
    validation_desc: "Only letters are allowed",
    icon: "iconEmail",
  },
  {
    label: "Document Number",
    value: 1,
    placeholder: "Search for document number",
    validation: [GenericValidators.dni],
    validation_desc: "Only letters are allowed",
    icon: "icDescription",
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

const tableColumns: TableColumns<ProviderResponse>[] = [
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
    label: "Email",
    cssLabel: ["font-bold", "text-sm"],
    property: "email",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "email",
    visible: true,
    download: true,
  },
  {
    label: "Document Type",
    cssLabel: ["font-bold", "text-sm"],
    property: "documentType",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "documentType",
    visible: true,
    download: true,
  },
  {
    label: "Document number",
    cssLabel: ["font-bold", "text-sm"],
    property: "documentNumber",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "documentNumber",
    visible: true,
    download: true,
  },
  {
    label: "Address",
    cssLabel: ["font-bold", "text-sm"],
    property: "address",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "address",
    visible: true,
    download: true,
  },
  {
    label: "Phone",
    cssLabel: ["font-bold", "text-sm"],
    property: "phone",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "phone",
    visible: true,
    download: true,
  },
  {
    label: "State",
    cssLabel: ["font-bold", "text-sm"],
    property: "stateProvider",
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
    property: "iconEdit",
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
    property: "iconDelete",
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

const getInputs = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  refresh: false,
};

export const ProviderComponentSettings = {
  iconProvider: IconsService.prototype.getIcon("iconProvider"),
  searchOptions,
  menuItems,
  tableColumns,
  filters,
  getInputs,
  initialSort: "id",
  initialSortAdress: "desc",
  columnsFilter: tableColumns.map((column) => {
    return {
      label: column.label,
      property: column.property,
      type: column.type,
    };
  }),
};
