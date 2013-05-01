/// <reference path="../Game.d.ts" />
/// <reference path="easing/Back.d.ts" />
/// <reference path="easing/Bounce.d.ts" />
/// <reference path="easing/Circular.d.ts" />
/// <reference path="easing/Cubic.d.ts" />
/// <reference path="easing/Elastic.d.ts" />
/// <reference path="easing/Exponential.d.ts" />
/// <reference path="easing/Linear.d.ts" />
/// <reference path="easing/Quadratic.d.ts" />
/// <reference path="easing/Quartic.d.ts" />
/// <reference path="easing/Quintic.d.ts" />
/// <reference path="easing/Sinusoidal.d.ts" />
module Phaser {
    class Tween {
        constructor(object, game: Game);
        private _game;
        private _manager;
        private _object;
        private _pausedTime;
        private _valuesStart;
        private _valuesEnd;
        private _duration;
        private _delayTime;
        private _startTime;
        private _easingFunction;
        private _interpolationFunction;
        private _chainedTweens;
        public onStart: Signal;
        public onUpdate: Signal;
        public onComplete: Signal;
        public to(properties, duration?: number, ease?: any, autoStart?: bool): Tween;
        public start(): Tween;
        public stop(): Tween;
        public parent : Game;
        public delay : number;
        public easing : any;
        public interpolation : any;
        public chain(tween: Tween): Tween;
        public debugValue;
        public update(time): bool;
    }
}
