export default class EventBinding {
    dispatcher: any;
    type: any;
    state: any;
    active: any;
    constructor(dispatcher: any, type: any);
    total(): number;
    get(callback: any): any;
    getIndex(callback: any): number;
    has(callback: any): any;
    add(callback: any, priority: any, once: any): void;
    sortHandler(listenerA: any, listenerB: any): 0 | 1 | -1;
    remove(callback: any): void;
    dispatch(event: any): void;
    removeAll(): void;
    tidy(): void;
    destroy(): void;
}
