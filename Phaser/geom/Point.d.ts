/// <reference path="../Game.d.ts" />
module Phaser {
    class Point {
        constructor(x?: number, y?: number);
        public x: number;
        public y: number;
        public add(toAdd: Point, output?: Point): Point;
        public addTo(x?: number, y?: number): Point;
        public subtractFrom(x?: number, y?: number): Point;
        public invert(): Point;
        public clamp(min: number, max: number): Point;
        public clampX(min: number, max: number): Point;
        public clampY(min: number, max: number): Point;
        public clone(output?: Point): Point;
        public copyFrom(source: Point): Point;
        public copyTo(target: Point): Point;
        public distanceTo(target: Point, round?: bool): number;
        static distanceBetween(pointA: Point, pointB: Point, round?: bool): number;
        public distanceCompare(target: Point, distance: number): bool;
        public equals(toCompare: Point): bool;
        public interpolate(pointA, pointB, f): void;
        public offset(dx: number, dy: number): Point;
        public polar(length, angle): void;
        public setTo(x: number, y: number): Point;
        public subtract(point: Point, output?: Point): Point;
        public toString(): string;
    }
}
