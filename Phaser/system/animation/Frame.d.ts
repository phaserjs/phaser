/// <reference path="../../Game.d.ts" />
module Phaser {
    class Frame {
        constructor(x: number, y: number, width: number, height: number, name: string);
        public x: number;
        public y: number;
        public width: number;
        public height: number;
        public index: number;
        public name: string;
        public rotated: bool;
        public rotationDirection: string;
        public trimmed: bool;
        public sourceSizeW: number;
        public sourceSizeH: number;
        public spriteSourceSizeX: number;
        public spriteSourceSizeY: number;
        public spriteSourceSizeW: number;
        public spriteSourceSizeH: number;
        public setRotation(rotated: bool, rotationDirection: string): void;
        public setTrim(trimmed: bool, actualWidth, actualHeight, destX, destY, destWidth, destHeight): void;
    }
}
