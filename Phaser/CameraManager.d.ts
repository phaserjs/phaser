/// <reference path="Game.d.ts" />
/// <reference path="system/Camera.d.ts" />
module Phaser {
    class CameraManager {
        constructor(game: Game, x: number, y: number, width: number, height: number);
        private _game;
        private _cameras;
        private _cameraInstance;
        public current: Camera;
        public getAll(): Camera[];
        public update(): void;
        public render(): void;
        public addCamera(x: number, y: number, width: number, height: number): Camera;
        public removeCamera(id: number): bool;
        public destroy(): void;
    }
}
