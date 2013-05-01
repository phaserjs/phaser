/// <reference path="../Game.d.ts" />
module Phaser {
    class MicroPoint {
        constructor(x?: number, y?: number, parent?: any);
        private _x;
        private _y;
        public parent: any;
        public x : number;
        public y : number;
        public copyFrom(source: any): MicroPoint;
        public copyTo(target: any): MicroPoint;
        public setTo(x: number, y: number, callParent?: bool): MicroPoint;
        public equals(toCompare): bool;
        public toString(): string;
    }
}
