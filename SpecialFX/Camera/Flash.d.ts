/// <reference path="../../Phaser/Game.d.ts" />
/// <reference path="../../Phaser/FXManager.d.ts" />
module Phaser.FX.Camera {
    class Flash {
        constructor(game: Game);
        private _game;
        private _fxFlashColor;
        private _fxFlashComplete;
        private _fxFlashDuration;
        private _fxFlashAlpha;
        public start(color?: number, duration?: number, onComplete?, force?: bool): void;
        public postUpdate(): void;
        public postRender(cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
    }
}
