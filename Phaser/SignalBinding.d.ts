/// <reference path="Signal.d.ts" />
module Phaser {
    class SignalBinding {
        constructor(signal: Signal, listener, isOnce: bool, listenerContext, priority?: number);
        private _listener;
        private _isOnce;
        public context;
        private _signal;
        public priority: number;
        public active: bool;
        public params;
        public execute(paramsArr?: any[]);
        public detach();
        public isBound(): bool;
        public isOnce(): bool;
        public getListener();
        public getSignal(): Signal;
        public _destroy(): void;
        public toString(): string;
    }
}
