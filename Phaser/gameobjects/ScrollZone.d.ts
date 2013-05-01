/// <reference path="../Game.d.ts" />
/// <reference path="../geom/Quad.d.ts" />
/// <reference path="ScrollRegion.d.ts" />
module Phaser {
    class ScrollZone extends GameObject {
        constructor(game: Game, key: string, x?: number, y?: number, width?: number, height?: number);
        private _texture;
        private _dynamicTexture;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public currentRegion: ScrollRegion;
        public regions: ScrollRegion[];
        public flipped: bool;
        public addRegion(x: number, y: number, width: number, height: number, speedX?: number, speedY?: number): ScrollRegion;
        public setSpeed(x: number, y: number): ScrollZone;
        public update(): void;
        public inCamera(camera: Rectangle): bool;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool;
        private createRepeatingTexture(regionWidth, regionHeight);
    }
}
