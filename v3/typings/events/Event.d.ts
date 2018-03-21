export default class Event {
    type: any;
    target: any;
    private _propagate;
    constructor(type: any);
    reset(target: any): void;
    stopPropagation(): void;
}
