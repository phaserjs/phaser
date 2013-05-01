/// <reference path="../Game.d.ts" />
/// <reference path="../AnimationManager.d.ts" />
/// <reference path="GameObject.d.ts" />
/// <reference path="../system/Camera.d.ts" />
module Phaser {
    class Sprite extends GameObject {
        constructor(game: Game, x?: number, y?: number, key?: string);
        private _texture;
        private _dynamicTexture;
        private _sx;
        private _sy;
        private _sw;
        private _sh;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public animations: AnimationManager;
        public renderDebug: bool;
        public renderDebugColor: string;
        public renderDebugPointColor: string;
        public flipped: bool;
        public loadGraphic(key: string): Sprite;
        public loadDynamicTexture(texture: DynamicTexture): Sprite;
        public makeGraphic(width: number, height: number, color?: number): Sprite;
        public inCamera(camera: Rectangle): bool;
        public postUpdate(): void;
        public frame : number;
        public frameName : string;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool;
        private renderBounds(camera, cameraOffsetX, cameraOffsetY);
        public renderDebugInfo(x: number, y: number, color?: string): void;
    }
}
