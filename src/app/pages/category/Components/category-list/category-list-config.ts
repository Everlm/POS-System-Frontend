import { Category } from "src/app/pages/category/models/category-response.interface";
import icCategory from "@iconify/icons-ic/twotone-category";
import icViewHeadLine from "@iconify/icons-ic/twotone-view-headline";
import icLabel from "@iconify/icons-ic/twotone-label";
import { GenericValidators } from "@shared/validators/generic-validators";
import icCalendar from "@iconify/icons-ic/twotone-calendar-today";
import { TableColumns } from "@shared/models/list-table.interface";
import { SearchOptions } from "@shared/models/search-options.interface";
import { MenuItems } from "@shared/models/menu-items.interface";

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
    label: "Description",
    value: 2,
    placeholder: "Search for description",
    validation: [GenericValidators.defaultDescription],
    validation_desc: "Only letters and number are allowed",
    icon: "icDescription",
  },
];

const menuItems: MenuItems[] = [
  {
    type: "link",
    id: "all",
    icon: icViewHeadLine,
    label: "All",
  },
  {
    type: "link",
    id: "Active",
    value: 1,
    icon: icLabel,
    label: "Active",
    class: {
      icon: "text-green",
    },
  },
  {
    type: "link",
    id: "Inactive",
    value: 0,
    icon: icLabel,
    label: "Inactive",
    class: {
      icon: "text-gray",
    },
  },
];

const tableColumns: TableColumns<Category>[] = [
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
    label: "Description",
    cssLabel: ["font-bold", "text-sm"],
    property: "description",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "text",
    sticky: false,
    sort: true,
    sortProperty: "description",
    visible: true,
    download: true,
  },
  {
    label: "Creation Date",
    cssLabel: ["font-bold", "text-sm"],
    property: "auditCreateDate",
    cssProperty: ["font-semibold", "text-sm", "text-left"],
    type: "datetime",
    sticky: false,
    sort: true,
    visible: true,
    download: true,
  },
  {
    label: "State",
    cssLabel: ["font-bold", "text-sm"],
    property: "stateCategory",
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
  startDate: null,
  endDate: null,
};

const inputs = {
  numFilter: 0,
  textFilter: "",
  stateFilter: null,
  startDate: null,
  endDate: null,
};

export const componentSettings = {
  //Icons
  icCategory: icCategory,
  icCalendar: icCalendar,
  //Layout Settings
  menuOpen: false,
  //Table Settings
  tableColumns: tableColumns,
  initialSort: "Id",
  initialSortDir: "desc",
  getInputs: inputs,
  buttonLabeEdit: "EDIT",
  buttonLabelDelete: "DELETE",
  //Search Filters
  menuItems: menuItems,
  searchOptions: searchOptions,
  filters_dates_active: false,
  filters: filters,
  datesFilterArray: ["Creation Date"],
  columnsFilter: tableColumns.map((column) => {
    return {
      label: column.label,
      property: column.property,
      type: column.type,
    };
  }),
};
