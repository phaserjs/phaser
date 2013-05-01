/// <reference path="../../Game.d.ts" />
module Phaser {
    class BootScreen {
        constructor(game: Game);
        private _game;
        private _logo;
        private _logoData;
        private _color1;
        private _color2;
        private _fade;
        public update(): void;
        public render(): void;
        private colorCycle();
    }
}
