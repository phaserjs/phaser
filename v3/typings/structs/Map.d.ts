export default class Map {
    entries: any;
    constructor(elements?: any);
    add(a: any, b?: any): this;
    set(key: any, value: any): this;
    delete(key: any): this;
    keys(): void;
    values(): void;
    dump(): void;
    get(property: any, value: any): any;
    each(callback: any): void;
    iterate(callback: any): void;
    clear(): void;
    contains(value: any): boolean;
    union(set: any): Map;
    intersect(set: any): Map;
    difference(set: any): Map;
    size: any;
}
