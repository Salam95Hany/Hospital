export interface FilterModel {
    categoryName?: string;
    categoryDisplayName?: string;
    itemId?: string;
    itemKey?: string;
    itemValue?: string;
    isChecked?: boolean;
    from?: string;
    to?: string;
    filterType?: string;
    isVisible?: boolean;
    filterItems?: FilterModel[];
    rangeValue?: { startDate: any; endDate: any };
    displayOrder?: number;
}