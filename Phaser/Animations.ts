/// <reference path="Cache.ts" />
/// <reference path="Game.ts" />
/// <reference path="Sprite.ts" />
/// <reference path="system/animation/Animation.ts" />
/// <reference path="system/animation/AnimationLoader.ts" />
/// <reference path="system/animation/Frame.ts" />
/// <reference path="system/animation/FrameData.ts" />

class Animations {

    constructor(game: Game, parent: Sprite) {

        this._game = game;
        this._parent = parent;
        this._anims = {};

    }

    private _game: Game;
    private _parent: Sprite;

    private _anims: {};
    private _frameIndex: number;
    private _frameData: FrameData = null;

    public currentAnim: Animation;
    public currentFrame: Frame = null;

    public loadFrameData(frameData: FrameData) {

        this._frameData = frameData;

        this.frame = 0;

    }
    
    public add(name: string, frames:number[] = null, frameRate: number = 60, loop: bool = false) {

        if (this._frameData == null)
        {
            return;
        }

        if (frames == null)
        {
            frames = this._frameData.getFrameIndexes();
        }
        else
        {
            if (this.validateFrames(frames) == false)
            {
                return;
            }
        }

        this._anims[name] = new Animation(this._game, this._parent, this._frameData, name, frames, frameRate, loop);

        this.currentAnim = this._anims[name];

    }

    private validateFrames(frames:number[]):bool {

        var result = true;

        for (var i = 0; i < frames.length; i++)
        {
            if (frames[i] > this._frameData.total)
            {
                return false;
            }
        }

    }

    public play(name: string, frameRate?: number = null, loop?: bool) {

        if (this._anims[name])
        {
            this.currentAnim = this._anims[name];
            this.currentAnim.play(frameRate, loop);
        }
    
    }

    public stop(name: string) {

        if (this._anims[name])
        {
            this.currentAnim = this._anims[name];
            this.currentAnim.stop();
        }
    
    }

    public update() {

        if (this.currentAnim && this.currentAnim.update() == true)
        {
            this.currentFrame = this.currentAnim.currentFrame;
            this._parent.bounds.width = this.currentFrame.width;
            this._parent.bounds.height = this.currentFrame.height;
        }

    }

    public get frameTotal(): number {
        return this._frameData.total;
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
    
    public get frameName(): string {
        return this.currentFrame.name;
    }

    public set frameName(value: string) {

        this.currentFrame = this._frameData.getFrameByName(value);

        if (this.currentFrame !== null)
        {
            this._parent.bounds.width = this.currentFrame.width;
            this._parent.bounds.height = this.currentFrame.height;
            this._frameIndex = this.currentFrame.index;
        }

    }

}
