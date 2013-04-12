/// <reference path="../../Game.ts" />
/// <reference path="../../Sprite.ts" />
/// <reference path="Animation.ts" />
/// <reference path="AnimationLoader.ts" />
/// <reference path="FrameData.ts" />

class Frame {

    constructor(x: number, y: number, width: number, height: number) {

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.rotated = false;
        this.trimmed = false;

    }

    //  Position within the image to cut from
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    //  Useful for Texture Atlas files
    public filename: string;

    //  Rotated? (not yet implemented)
    public rotated: bool = false;

    //  Either cw or ccw, rotation is always 90 degrees
    public rotationDirection: string = 'cw';

    //  Was it trimmed when packed?
    public trimmed: bool;

    //  The coordinates of the trimmed sprite inside the original sprite
    public sourceSizeW: number;
    public sourceSizeH: number;
    public spriteSourceSizeX: number;
    public spriteSourceSizeY: number;
    public spriteSourceSizeW: number;
    public spriteSourceSizeH: number;

    public setRotation(rotated: bool, rotationDirection: string) {
        //  Not yet supported
    }

    public setTrim(trimmed: bool, actualWidth, actualHeight, destX, destY, destWidth, destHeight, ) {

        this.trimmed = trimmed;

        this.sourceSizeW = actualWidth;
        this.sourceSizeH = actualHeight;
        this.spriteSourceSizeX = destX;
        this.spriteSourceSizeY = destY;
        this.spriteSourceSizeW = destWidth;
        this.spriteSourceSizeH = destHeight;

    }

}
