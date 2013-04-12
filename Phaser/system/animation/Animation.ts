/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="AnimationLoader.ts" />
/// <reference path="Frame.ts" />
/// <reference path="FrameData.ts" />

/**
 *	Animation
 *
 *	@desc 		Loads Sprite Sheets and Texture Atlas formats into a unified FrameData object
 *
 *	@version 	1.0 - 22nd March 2013
 *	@author 	Richard Davey
 */

class Animation {

    constructor(game: Game, parent: Sprite, frameData: FrameData, name, frames, delay, looped) {

        this._game = game;
        this._parent = parent;
        this._frames = frames;
        this._frameData = frameData;

        this.name = name;
        this.delay = 1000 / delay;
        this.looped = looped;

        this.isFinished = false;
        this.isPlaying = false;

    }

    private _game: Game;
    private _parent: Sprite;
    private _frames: number[];
    private _frameData: FrameData;
    private _frameIndex: number;

    private _timeLastFrame: number;
    private _timeNextFrame: number;

    public name: string;
    public currentFrame: Frame;

    public isFinished: bool;
    public isPlaying: bool;
    public looped: bool;
    public delay: number;

    public get frameTotal(): number {
        return this._frames.length;
    }

    public get frame(): number {
        return this._frameIndex;
    }

    public set frame(value: number) {

        this.currentFrame = this._frameData.getFrame(value);

        if (this.currentFrame !== null)
        {
            this._parent.bounds.width = this.currentFrame.width;
            this._parent.bounds.height = this.currentFrame.height;
            this._frameIndex = value;
        }

    }

    public play(frameRate?: number = null, loop?: bool) {

        if (frameRate !== null)
        {
            this.delay = 1000 / frameRate;
        }

        if (loop !== undefined)
        {
            this.looped = loop;
        }

        this.isPlaying = true;
        this.isFinished = false;

        this._timeLastFrame = this._game.time.now;
        this._timeNextFrame = this._game.time.now + this.delay;

        this._frameIndex = 0;
        this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);

    }

    private onComplete() {

        this.isPlaying = false;
        this.isFinished = true;
        //  callback

    }

    public stop() {

        this.isPlaying = false;
        this.isFinished = true;

    }

    public update():bool {

        if (this.isPlaying == true && this._game.time.now >= this._timeNextFrame)
        {
            this._frameIndex++;

            if (this._frameIndex == this._frames.length)
            {
                if (this.looped)
                {
                    this._frameIndex = 0;
                    this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
                }
                else
                {
                    this.onComplete();
                }
            }
            else
            {
                this.currentFrame = this._frameData.getFrame(this._frames[this._frameIndex]);
            }

            this._timeLastFrame = this._game.time.now;
            this._timeNextFrame = this._game.time.now + this.delay;

            return true;
        }

        return false;

    }

    public destroy() {

        this._game = null;
        this._parent = null;
        this._frames = null;
        this._frameData = null;
        this.currentFrame = null;
        this.isPlaying = false;

    }

}
