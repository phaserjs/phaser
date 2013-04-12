/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="Animation.ts" />
/// <reference path="AnimationLoader.ts" />
/// <reference path="Frame.ts" />

class FrameData {

    constructor() {

        this._frames = [];

    }

    private _frames: Frame[];

    public get total(): number {
        return this._frames.length;
    }

    public addFrame(frame: Frame):Frame {

        this._frames.push(frame);

        return frame;

    }

    public getFrame(frame: number):Frame {

        if (this._frames[frame])
        {
            return this._frames[frame];
        }

        return null;

    }

    public getFrameRange(start: number, end: number, output?:Frame[] = []):Frame[] {

        for (var i = start; i <= end; i++)
        {
            output.push(this._frames[i]);
        }

        return output;

    }

    public getFrameIndexes(output?:number[] = []):number[] {

        output.length = 0;

        for (var i = 0; i < this._frames.length; i++)
        {
            output.push(i);
        }

        return output;

    }

    public getAllFrames():Frame[] {
        return this._frames;
    }

    public getFrames(range: number[]) {

        var output: Frame[] = [];

        for (var i = 0; i < range.length; i++)
        {
            output.push(this._frames[i]);
        }

        return output;

    }

}
