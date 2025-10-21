export interface FilterModel {
    categoryName?: string;
    categoryNameAr?: string;
    itemId?: string;
    itemKey?: string;
    itemValue?: string;
    isChecked?: boolean;
    from?: string;
    to?: string;
    filterType?: string;
    isVisible?: boolean;
    filterItems?: FilterModel[];
    displayOrder?: number;
}