/// <reference path="../Game.d.ts" />
module Phaser {
    class IntersectResult {
        public result: bool;
        public x: number;
        public y: number;
        public x1: number;
        public y1: number;
        public x2: number;
        public y2: number;
        public width: number;
        public height: number;
        public setTo(x1: number, y1: number, x2?: number, y2?: number, width?: number, height?: number): void;
    }
}
