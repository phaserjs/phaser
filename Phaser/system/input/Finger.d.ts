/// <reference path="../../Game.d.ts" />
module Phaser {
    class Finger {
        constructor(game: Game);
        private _game;
        public identifier: number;
        public active: bool;
        public point: Point;
        public circle: Circle;
        public withinGame: bool;
        public clientX: number;
        public clientY: number;
        public pageX: number;
        public pageY: number;
        public screenX: number;
        public screenY: number;
        public x: number;
        public y: number;
        public target;
        public isDown: bool;
        public isUp: bool;
        public timeDown: number;
        public duration: number;
        public timeUp: number;
        public justPressedRate: number;
        public justReleasedRate: number;
        public start(event): void;
        public move(event): void;
        public leave(event): void;
        public stop(event): void;
        public justPressed(duration?: number): bool;
        public justReleased(duration?: number): bool;
        public toString(): string;
    }
}
