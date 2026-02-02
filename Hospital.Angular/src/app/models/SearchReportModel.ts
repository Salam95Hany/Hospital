import { FilterModel } from "./FilterModel";

export interface SearchReportModel {
    reportType: string;
    userName?: string;
    queryString?: QueryString[];
    filterList?:FilterModel[];
}

export interface QueryString {
    key: string;
    value: string;
}