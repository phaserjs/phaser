/// <reference path="SignalBinding.d.ts" />
module Phaser {
    class Signal {
        private _bindings;
        private _prevParams;
        static VERSION: string;
        public memorize: bool;
        private _shouldPropagate;
        public active: bool;
        public validateListener(listener, fnName): void;
        private _registerListener(listener, isOnce, listenerContext, priority);
        private _addBinding(binding);
        private _indexOfListener(listener, context);
        public has(listener, context?: any): bool;
        public add(listener, listenerContext?: any, priority?: number): SignalBinding;
        public addOnce(listener, listenerContext?: any, priority?: number): SignalBinding;
        public remove(listener, context?: any);
        public removeAll(): void;
        public getNumListeners(): number;
        public halt(): void;
        public dispatch(...paramsArr: any[]): void;
        public forget(): void;
        public dispose(): void;
        public toString(): string;
    }
}
