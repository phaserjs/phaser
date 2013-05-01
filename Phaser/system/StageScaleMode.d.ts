/// <reference path="../Game.d.ts" />
module Phaser {
    class StageScaleMode {
        constructor(game: Game);
        private _game;
        private _startHeight;
        private _iterations;
        private _check;
        static EXACT_FIT: number;
        static NO_SCALE: number;
        static SHOW_ALL: number;
        public width: number;
        public height: number;
        public orientation;
        public update(): void;
        public isLandscape : bool;
        private checkOrientation(event);
        private refresh();
        private setScreenSize();
    }
}
