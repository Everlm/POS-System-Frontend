import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { Category } from "src/app/responses/category/category.response";
import icCategory from "@iconify/icons-ic/twotone-category";
import { ListTableMenu } from "src/app/commons/list-table-menu.interface";
import icViewHeadLine from "@iconify/icons-ic/twotone-view-headline";
import icLabel from "@iconify/icons-ic/twotone-label";
import { GenericValidators } from "@shared/validators/generic-validators";

const searchOptions = [
    {
        label: "Name",
        value: 1,
        placeholder: "Search for name",
        validation: [GenericValidators.defaultName],
        validation_desc: "Only letters are allowed",
        min_length: 2
    },
    {
        label: "Description",
        value: 2,
        placeholder: "Search for description",
        validation: [GenericValidators.defaultDescription],
        validation_desc: "Only letters and number are allowed",
        min_length: 2
    }
]

const menuItems: ListTableMenu[] = [
    {
        type: "link",
        id: "all",
        icon: icViewHeadLine,
        label: "All"
    },
    {
        type: "link",
        id: "Active",
        value: 1,
        icon: icLabel,
        label: "Active",
        classes: {
            icon: "text-green"
        },
    },
    {
        type: "link",
        id: "Inactive",
        value: 0,
        icon: icLabel,
        label: "Inactive",
        classes: {
            icon: "text-gray"
        },
    }
]

const tableColumns: TableColumn<Category>[] = [
    {
        label: "Name",
        property: "name",
        type: "text",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "Description",
        property: "description",
        type: "textTruncate",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "Creation Date",
        property: "auditCreateDate",
        type: "datetime",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "State",
        property: "stateCategory",
        type: "badge",
        cssClasses: ["font-medium", "w-10"]
    },
    {
        label: "Actions",
        property: 'menu',
        type: 'buttonGroup',
        buttonItems: [
            {
                buttonLabel: 'EDIT',
                buttonAction: "edit",
                buttonCondition: null,
                disable: false
            },
            {
                buttonLabel: 'DELETE',
                buttonAction: "delete",
                buttonCondition: null,
                disable: false
            }
        ],
        cssClasses: ["font-medium", "w-10"]
    }
]

const filters = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startDate: null,
    endDate: null
}

const inputs = {
    numFilter: 0,
    textFilter: "",
    stateFilter: null,
    startDate: null,
    endDate: null
}

export const componentSettings = {
    //Icons
    icCategory: icCategory,
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
    searchOptions : searchOptions,
    filters: filters,
    columnsFilter: tableColumns.map((column) => {
        return {
            label: column.label,
            property: column.property,
            type: column.type
        }
    })
}
