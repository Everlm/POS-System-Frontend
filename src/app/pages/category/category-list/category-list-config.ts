import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { Category } from "src/app/responses/category/category.response";
import icCategory from "@iconify/icons-ic/twotone-category";

const tableColumns: TableColumn<Category>[] = [
    {
        label: "Nombre",
        property: "name",
        type: "text",
        cssClasses: ['font-medium', 'w-10']

    },
    {
        label: "Description",
        property: "description",
        type: "textTruncate",
        cssClasses: ['font-medium', 'w-10']

    },
    {
        label: "Creation",
        property: "auditCreateDate",
        type: "datetime",
        cssClasses: ['font-medium', 'w-10']

    },
    {
        label: "State",
        property: "stateCategory",
        type: "badge",
        cssClasses: ['font-medium', 'w-10']

    },
    {
        label: "Actions",
        property: 'menu',
        type: 'buttonGroup',
        buttonItems: [
            {
                buttonLabel: "EDIT",
                buttonAction: "edit",
                buttonCondition: null,
                disable: false
            },
            {
                buttonLabel: "DELETE",
                buttonAction: "delete",
                buttonCondition: null,
                disable: false
            }

        ],
        cssClasses: ['font-medium', 'w-10']
    }
]

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
    //Table Settings
    tableColumns: tableColumns,
    initialSort: "Id",
    initialSortDir: "desc",
    getInputs : inputs,
    buttonLabeEdit: "EDIT",
    buttonLabelDelete: "DELETE",
    columnsFilter: tableColumns.map((column) => { return { label: column.label, property: column.property, type: column.type } })


}