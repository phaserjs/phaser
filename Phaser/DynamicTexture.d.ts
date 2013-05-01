/// <reference path="Game.d.ts" />
module Phaser {
    class DynamicTexture {
        constructor(game: Game, width: number, height: number);
        private _game;
        private _sx;
        private _sy;
        private _sw;
        private _sh;
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public bounds: Rectangle;
        public canvas: HTMLCanvasElement;
        public context: CanvasRenderingContext2D;
        public getPixel(x: number, y: number): number;
        public getPixel32(x: number, y: number): number;
        public getPixels(rect: Rectangle): ImageData;
        public setPixel(x: number, y: number, color: number): void;
        public setPixel32(x: number, y: number, color: number): void;
        public setPixels(rect: Rectangle, input): void;
        public fillRect(rect: Rectangle, color: number): void;
        public pasteImage(key: string, frame?: number, destX?: number, destY?: number, destWidth?: number, destHeight?: number): void;
        public copyPixels(sourceTexture: DynamicTexture, sourceRect: Rectangle, destPoint: Point): void;
        public clear(): void;
        public width : number;
        public height : number;
        private getColor32(alpha, red, green, blue);
        private getColor(red, green, blue);
    }
}
