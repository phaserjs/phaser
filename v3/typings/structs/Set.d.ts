export default class Set {
    entries: any;
    constructor(elements?: any);
    add(value: any): void;
    set(value: any): this;
    get(property: any, value: any): any;
    delete(value: any): this;
    dump(): void;
    each(callback: any): this;
    iterate(callback: any): this;
    clear(): this;
    contains(value: any): boolean;
    union(set: any): Set;
    intersect(set: any): Set;
    difference(set: any): Set;
    size: any;
}
