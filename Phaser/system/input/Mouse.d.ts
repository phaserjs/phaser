/// <reference path="../../Game.d.ts" />
module Phaser {
    class Mouse {
        constructor(game: Game);
        private _game;
        private _x;
        private _y;
        public button: number;
        static LEFT_BUTTON: number;
        static MIDDLE_BUTTON: number;
        static RIGHT_BUTTON: number;
        public isDown: bool;
        public isUp: bool;
        public timeDown: number;
        public duration: number;
        public timeUp: number;
        public start(): void;
        public reset(): void;
        public onMouseDown(event: MouseEvent): void;
        public update(): void;
        public onMouseMove(event: MouseEvent): void;
        public onMouseUp(event: MouseEvent): void;
    }
}
