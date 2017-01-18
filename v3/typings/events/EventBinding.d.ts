import EventDispatcher from './EventDispatcher';
export default class EventBinding {
    dispatcher: EventDispatcher;
    type: any;
    state: number;
    active: {
        state: number;
        callback: any;
    }[];
    constructor(dispatcher: EventDispatcher, type: any);
    total(): number;
    get(callback: any): {
        state: number;
        callback: any;
    };
    getIndex(callback: any): number;
    has(callback: any): {
        state: number;
        callback: any;
    };
    add(callback: any, priority: any, once: any): void;
    sortHandler(listenerA: any, listenerB: any): 0 | 1 | -1;
    remove(callback: any): void;
    dispatch(event: any): void;
    removeAll(): void;
    tidy(): void;
    destroy(): void;
}
