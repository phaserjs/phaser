/// <reference path="../Game.d.ts" />
module Phaser {
    class Circle {
        constructor(x?: number, y?: number, diameter?: number);
        private _diameter;
        private _radius;
        public x: number;
        public y: number;
        public diameter : number;
        public radius : number;
        public circumference(): number;
        public bottom : number;
        public left : number;
        public right : number;
        public top : number;
        public area : number;
        public isEmpty : bool;
        public intersectCircleLine(line: Line): bool;
        public clone(output?: Circle): Circle;
        public contains(x: number, y: number): bool;
        public containsPoint(point: Point): bool;
        public containsCircle(circle: Circle): bool;
        public copyFrom(source: Circle): Circle;
        public copyTo(target: Circle): Circle;
        public distanceTo(target: any, round?: bool): number;
        public equals(toCompare: Circle): bool;
        public intersects(toIntersect: Circle): bool;
        public circumferencePoint(angle: number, asDegrees?: bool, output?: Point): Point;
        public offset(dx: number, dy: number): Circle;
        public offsetPoint(point: Point): Circle;
        public setTo(x: number, y: number, diameter: number): Circle;
        public toString(): string;
    }
}
