/// <reference path="../Game.d.ts" />
module Phaser {
    class Quad {
        constructor(x?: number, y?: number, width?: number, height?: number);
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public setTo(x: number, y: number, width: number, height: number): Quad;
        public left : number;
        public right : number;
        public top : number;
        public bottom : number;
        public halfWidth : number;
        public halfHeight : number;
        public intersects(q, t?: number): bool;
        public toString(): string;
    }
}
