export class ConfiguracionCvPdf {

    dropdownList = [
            { item_id: 1, item_text: 'cursos' },
            { item_id: 2, item_text: 'herramientas' },
            { item_id: 3, item_text: 'proyectos' },
    ];

    selectedItems = [
        { item_id: 1, item_text: 'cursos' },
        { item_id: 2, item_text: 'herramientas' },
        { item_id: 3, item_text: 'proyectos' },
    ];

    dropdownSettings = {
        showSelectedItemsAtTop: false,
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        itemsShowLimit: 3,
        allowSearchFilter: false
    };
}

