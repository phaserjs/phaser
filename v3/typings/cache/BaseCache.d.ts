export default class BaseCache {
    entries: Map<any, any>;
    constructor();
    add(key: any, data: any): void;
    has(key: any): boolean;
    get(key: any): any;
    remove(key: any): void;
    destroy(): void;
}
