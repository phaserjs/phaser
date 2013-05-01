/// <reference path="../Game.d.ts" />
module Phaser {
    class RequestAnimationFrame {
        constructor(callback, callbackContext);
        private _callback;
        private _callbackContext;
        public setCallback(callback): void;
        private _timeOutID;
        private _isSetTimeOut;
        public isUsingSetTimeOut(): bool;
        public isUsingRAF(): bool;
        public lastTime: number;
        public currentTime: number;
        public isRunning: bool;
        public start(callback?): void;
        public stop(): void;
        public RAFUpdate(): void;
        public SetTimeoutUpdate(): void;
    }
}
