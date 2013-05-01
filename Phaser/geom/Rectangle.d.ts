/// <reference path="../Game.d.ts" />
/// <reference path="MicroPoint.d.ts" />
module Phaser {
    class Rectangle {
        constructor(x?: number, y?: number, width?: number, height?: number);
        private _tempX;
        private _tempY;
        private _tempWidth;
        private _tempHeight;
        public x : number;
        public y : number;
        public topLeft: MicroPoint;
        public topCenter: MicroPoint;
        public topRight: MicroPoint;
        public leftCenter: MicroPoint;
        public center: MicroPoint;
        public rightCenter: MicroPoint;
        public bottomLeft: MicroPoint;
        public bottomCenter: MicroPoint;
        public bottomRight: MicroPoint;
        private _width;
        private _height;
        private _halfWidth;
        private _halfHeight;
        public length: number;
        public updateBounds(): void;
        public width : number;
        public height : number;
        public halfWidth : number;
        public halfHeight : number;
        public bottom : number;
        public left : number;
        public right : number;
        public size(output?: Point): Point;
        public volume : number;
        public perimeter : number;
        public top : number;
        public clone(output?: Rectangle): Rectangle;
        public contains(x: number, y: number): bool;
        public containsPoint(point: any): bool;
        public containsRect(rect: Rectangle): bool;
        public copyFrom(source: Rectangle): Rectangle;
        public copyTo(target: Rectangle): Rectangle;
        public equals(toCompare: Rectangle): bool;
        public inflate(dx: number, dy: number): Rectangle;
        public inflatePoint(point: Point): Rectangle;
        public intersection(toIntersect: Rectangle, output?: Rectangle): Rectangle;
        public intersects(r2: Rectangle, t?: number): bool;
        public isEmpty : bool;
        public offset(dx: number, dy: number): Rectangle;
        public offsetPoint(point: Point): Rectangle;
        public setEmpty(): Rectangle;
        public setTo(x: number, y: number, width: number, height: number): Rectangle;
        public union(toUnion: Rectangle, output?: Rectangle): Rectangle;
        public toString(): string;
    }
}
