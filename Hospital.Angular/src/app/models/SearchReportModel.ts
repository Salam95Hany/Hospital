
export interface SearchReportModel {
    reportType: string;
    queryString?: QueryString[];
}

export interface QueryString {
    key: string;
    value: string;
}