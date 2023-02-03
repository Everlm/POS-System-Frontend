import { TableColumn } from "src/@vex/interfaces/table-column.interface";
import { Category } from "src/app/responses/category/category.response";
import IcCategory from "@iconify/icons-ic/twotone-category";

const tableColums: TableColumn<Category>[] = [
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
        label: "Creation Date",
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
        label: "",
        property: 'menu',
        type: 'buttonGroup',
        buttonItems: [
            {
                buttonLabel: "Edit",
                buttonAction: "edit",
                buttonCondition: null,
                disable: false
            },
            {
                buttonLabel: "Delete",
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
    IcCategory: IcCategory,
    //Table Settings
    tableColums: tableColums,
    initialSort: "Id",
    initialSortDir: "desc",
    getInputs : inputs,
    buttonLabelEdit: "Edit",
    buttonLabelDelete: "Delete",
    columnsFilter: tableColums.map((column) => { return { label: column.label, property: column.property, type: column.type } })


}