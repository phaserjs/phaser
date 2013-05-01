/// <reference path="../../Game.d.ts" />
module Phaser {
    class Animation {
        constructor(game: Game, parent: Sprite, frameData: FrameData, name: string, frames, delay: number, looped: bool);
        private _game;
        private _parent;
        private _frames;
        private _frameData;
        private _frameIndex;
        private _timeLastFrame;
        private _timeNextFrame;
        public name: string;
        public currentFrame: Frame;
        public isFinished: bool;
        public isPlaying: bool;
        public looped: bool;
        public delay: number;
        public frameTotal : number;
        public frame : number;
        public play(frameRate?: number, loop?: bool): void;
        public restart(): void;
        public stop(): void;
        public update(): bool;
        public destroy(): void;
        private onComplete();
    }
}
