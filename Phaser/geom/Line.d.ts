/// <reference path="../Game.d.ts" />
module Phaser {
    class Line {
        constructor(x1?: number, y1?: number, x2?: number, y2?: number);
        public x1: number;
        public y1: number;
        public x2: number;
        public y2: number;
        public clone(output?: Line): Line;
        public copyFrom(source: Line): Line;
        public copyTo(target: Line): Line;
        public setTo(x1?: number, y1?: number, x2?: number, y2?: number): Line;
        public width : number;
        public height : number;
        public length : number;
        public getY(x: number): number;
        public angle : number;
        public slope : number;
        public perpSlope : number;
        public yIntercept : number;
        public isPointOnLine(x: number, y: number): bool;
        public isPointOnLineSegment(x: number, y: number): bool;
        public intersectLineLine(line): any;
        public perp(x: number, y: number, output?: Line): Line;
        public toString(): string;
    }
}
