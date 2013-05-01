/// <reference path="../../Game.d.ts" />
/// <reference path="../../Signal.d.ts" />
module Phaser {
    class Input {
        constructor(game: Game);
        private _game;
        public mouse: Mouse;
        public keyboard: Keyboard;
        public touch: Touch;
        public x: number;
        public y: number;
        public scaleX: number;
        public scaleY: number;
        public worldX: number;
        public worldY: number;
        public onDown: Signal;
        public onUp: Signal;
        public update(): void;
        public reset(): void;
        public getWorldX(camera?: Camera): number;
        public getWorldY(camera?: Camera): number;
        public renderDebugInfo(x: number, y: number, color?: string): void;
    }
}
