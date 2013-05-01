/// <reference path="../../Game.d.ts" />
module Phaser {
    class PauseScreen {
        constructor(game: Game, width: number, height: number);
        private _game;
        private _canvas;
        private _context;
        private _color;
        private _fade;
        public onPaused(): void;
        public onResume(): void;
        public update(): void;
        public render(): void;
        private fadeOut();
        private fadeIn();
    }
}
