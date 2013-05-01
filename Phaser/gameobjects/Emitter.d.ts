/// <reference path="../Game.d.ts" />
/// <reference path="../Group.d.ts" />
module Phaser {
    class Emitter extends Group {
        constructor(game: Game, X?: number, Y?: number, Size?: number);
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public minParticleSpeed: MicroPoint;
        public maxParticleSpeed: MicroPoint;
        public particleDrag: MicroPoint;
        public minRotation: number;
        public maxRotation: number;
        public gravity: number;
        public on: bool;
        public frequency: number;
        public lifespan: number;
        public bounce: number;
        public particleClass;
        private _quantity;
        private _explode;
        private _timer;
        private _counter;
        private _point;
        public destroy(): void;
        public makeParticles(Graphics, Quantity?: number, BakedRotations?: number, Multiple?: bool, Collide?: number): Emitter;
        public update(): void;
        public kill(): void;
        public start(Explode?: bool, Lifespan?: number, Frequency?: number, Quantity?: number): void;
        public emitParticle(): void;
        public setSize(Width: number, Height: number): void;
        public setXSpeed(Min?: number, Max?: number): void;
        public setYSpeed(Min?: number, Max?: number): void;
        public setRotation(Min?: number, Max?: number): void;
        public at(Object): void;
    }
}
