export default class EventDispatcher {
    bindings: any;
    filters: any;
    hasFilters: any;
    constructor();
    getBinding(type: any): any;
    createBinding(type: any): any;
    on(type: any, listener: any, priority: any): this;
    once(type: any, listener: any, priority: any): this;
    filter(callback: any): this;
    has(type: any, listener: any): any;
    total(type: any): any;
    off(type: any, listener: any): this;
    _dispatchHandler(event: any): void;
    dispatch(event: any): void;
    removeAll(type: any): this;
    removeAllFilters(): this;
    delete(type: any): this;
    deleteAll(): void;
    destroy(): void;
}
