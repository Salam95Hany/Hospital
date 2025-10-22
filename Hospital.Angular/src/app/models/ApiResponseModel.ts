export interface ApiResponseModel<T> {
    isSuccess: boolean;
    message: string | null;
    totalCount: number;
    results: T | null;
}