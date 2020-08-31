export class PageableResponse<T> {
    forEach(arg0: (element: any) => void) {
        throw new Error("Method not implemented")
    }

    public content: T[];
    public pageable: any;
    public totalElements: number;
    public last: boolean;
    public totalPages: number;
    public size: number;
    public number: number;
    public sort: any;
    public numberOfElements: number;
    public first: boolean;
    public empty: boolean;
}