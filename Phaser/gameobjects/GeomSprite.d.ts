/// <reference path="../Game.d.ts" />
module Phaser {
    class GeomSprite extends GameObject {
        constructor(game: Game, x?: number, y?: number);
        private _dx;
        private _dy;
        private _dw;
        private _dh;
        public type: number;
        static UNASSIGNED: number;
        static CIRCLE: number;
        static LINE: number;
        static POINT: number;
        static RECTANGLE: number;
        public circle: Circle;
        public line: Line;
        public point: Point;
        public rect: Rectangle;
        public renderOutline: bool;
        public renderFill: bool;
        public lineWidth: number;
        public lineColor: string;
        public fillColor: string;
        public loadCircle(circle: Circle): GeomSprite;
        public loadLine(line: Line): GeomSprite;
        public loadPoint(point: Point): GeomSprite;
        public loadRectangle(rect: Rectangle): GeomSprite;
        public createCircle(diameter: number): GeomSprite;
        public createLine(x: number, y: number): GeomSprite;
        public createPoint(): GeomSprite;
        public createRectangle(width: number, height: number): GeomSprite;
        public refresh(): void;
        public update(): void;
        public inCamera(camera: Rectangle): bool;
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number): bool;
        public renderPoint(offsetX, offsetY, point, size): void;
        public renderDebugInfo(x: number, y: number, color?: string): void;
        public collide(source: GeomSprite): bool;
    }
}
