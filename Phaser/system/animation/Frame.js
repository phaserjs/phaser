/// <reference path="../../Game.ts" />
/**
* Phaser - Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*/
var Phaser;
(function (Phaser) {
    var Frame = (function () {
        function Frame(x, y, width, height, name) {
            //  Useful for Texture Atlas files (is set to the filename value)
            this.name = '';
            //  Rotated? (not yet implemented)
            this.rotated = false;
            //  Either cw or ccw, rotation is always 90 degrees
            this.rotationDirection = 'cw';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;
            this.rotated = false;
            this.trimmed = false;
        }
        Frame.prototype.setRotation = function (rotated, rotationDirection) {
            //  Not yet supported
                    };
        Frame.prototype.setTrim = function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
            this.trimmed = trimmed;
            this.sourceSizeW = actualWidth;
            this.sourceSizeH = actualHeight;
            this.spriteSourceSizeX = destX;
            this.spriteSourceSizeY = destY;
            this.spriteSourceSizeW = destWidth;
            this.spriteSourceSizeH = destHeight;
        };
        return Frame;
    })();
    Phaser.Frame = Frame;    
})(Phaser || (Phaser = {}));
