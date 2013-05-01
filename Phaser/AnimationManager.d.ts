/// <reference path="Game.d.ts" />
/// <reference path="gameobjects/Sprite.d.ts" />
/// <reference path="system/animation/Animation.d.ts" />
/// <reference path="system/animation/AnimationLoader.d.ts" />
/// <reference path="system/animation/Frame.d.ts" />
/// <reference path="system/animation/FrameData.d.ts" />
module Phaser {
    class AnimationManager {
        constructor(game: Game, parent: Sprite);
        private _game;
        private _parent;
        private _anims;
        private _frameIndex;
        private _frameData;
        public currentAnim: Animation;
        public currentFrame: Frame;
        public loadFrameData(frameData: FrameData): void;
        public add(name: string, frames?: any[], frameRate?: number, loop?: bool, useNumericIndex?: bool): void;
        private validateFrames(frames, useNumericIndex);
        public play(name: string, frameRate?: number, loop?: bool): void;
        public stop(name: string): void;
        public update(): void;
        public frameData : FrameData;
        public frameTotal : number;
        public frame : number;
        public frameName : string;
    }
}
