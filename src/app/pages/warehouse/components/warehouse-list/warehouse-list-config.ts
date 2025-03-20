import { TableColumns } from "@shared/models/list-table.interface";
import { MenuItems } from "@shared/models/menu-items.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { IconsService } from "@shared/services/icons.service";
import { GenericValidators } from "@shared/validators/generic-validators";
import { WarehouseResponse } from "../../models/warehouse-response.interface";

const searchOptions: SearchOptions[] = [
  {
    label: "Name",
    value: 1,
    placeholder: "Search for name",
    validation: [GenericValidators.defaultName],
    validation_desc: "Only letters are allowed",
    icon: "icName",
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

const tableColumns: TableColumns<WarehouseResponse>[] = [
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
    label: "State",
    cssLabel: ["font-bold", "text-sm"],
    property: "stateWarehouse",
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

const resetFilters = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: "",
  endDate: "",
  refresh: false,
};

const getInputs: string = "";

export const WarehouseComponentSettings = {
  icWarehouse: IconsService.prototype.getIcon("icWarehouse"),
  searchOptions,
  menuItems,
  tableColumns,
  filters,
  resetFilters,
  getInputs,
  initialSort: "id",
  initialSortAdress: "desc",
  fileName: "Listado-de-almacenes",
};
