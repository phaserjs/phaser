/// <reference path="../Game.d.ts" />
/// <reference path="../geom/Quad.d.ts" />
module Phaser {
    class ScrollRegion {
        constructor(x: number, y: number, width: number, height: number, speedX: number, speedY: number);
        private _A;
        private _B;
        private _C;
        private _D;
        private _bounds;
        private _scroll;
        private _anchorWidth;
        private _anchorHeight;
        private _inverseWidth;
        private _inverseHeight;
        public visible: bool;
        public scrollSpeed: MicroPoint;
        public update(delta: number): void;
        public render(context: CanvasRenderingContext2D, texture, dx: number, dy: number, dw: number, dh: number): void;
        private crop(context, texture, srcX, srcY, srcW, srcH, destX, destY, destW, destH, offsetX, offsetY);
    }
}
