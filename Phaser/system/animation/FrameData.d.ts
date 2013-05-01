/// <reference path="../../Game.d.ts" />
module Phaser {
    class FrameData {
        constructor();
        private _frames;
        private _frameNames;
        public total : number;
        public addFrame(frame: Frame): Frame;
        public getFrame(index: number): Frame;
        public getFrameByName(name: string): Frame;
        public checkFrameName(name: string): bool;
        public getFrameRange(start: number, end: number, output?: Frame[]): Frame[];
        public getFrameIndexes(output?: number[]): number[];
        public getFrameIndexesByName(input: string[]): number[];
        public getAllFrames(): Frame[];
        public getFrames(range: number[]): Frame[];
    }
}
