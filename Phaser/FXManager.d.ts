/// <reference path="Game.d.ts" />
module Phaser {
    class FXManager {
        constructor(game: Game);
        private _fx;
        private _length;
        private _game;
        public active: bool;
        public visible: bool;
        public add(effect): any;
        public preUpdate(): void;
        public postUpdate(): void;
        public preRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        public render(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        public postRender(camera: Camera, cameraX: number, cameraY: number, cameraWidth: number, cameraHeight: number): void;
        public destroy(): void;
    }
}
