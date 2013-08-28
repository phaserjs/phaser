/// <reference path="../_definitions.ts" />
/**
* Frame
*
* A Frame is a single frame of an animation and is part of a FrameData collection.
*
* @package    Phaser.Frame
* @author     Richard Davey <rich@photonstorm.com>
* @copyright  2013 Photon Storm Ltd.
* @license    https://github.com/photonstorm/phaser/blob/master/license.txt  MIT License
*/
var Phaser;
(function (Phaser) {
    var Frame = (function () {
        /**
        * Frame constructor
        * Create a new <code>Frame</code> with specific position, size and name.
        *
        * @param x {number} X position within the image to cut from.
        * @param y {number} Y position within the image to cut from.
        * @param width {number} Width of the frame.
        * @param height {number} Height of the frame.
        * @param name {string} Name of this frame.
        */
        function Frame(x, y, width, height, name) {
            /**
            * Useful for Texture Atlas files. (is set to the filename value)
            */
            this.name = '';
            /**
            * Rotated? (not yet implemented)
            */
            this.rotated = false;
            /**
            * Either cw or ccw, rotation is always 90 degrees.
            */
            this.rotationDirection = 'cw';
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;
            this.rotated = false;
            this.trimmed = false;
        }
        Frame.prototype.setRotation = /**
        * Set rotation of this frame. (Not yet supported!)
        */
        function (rotated, rotationDirection) {
            //  Not yet supported
                    };
        Frame.prototype.setTrim = /**
        * Set trim of the frame.
        * @param trimmed {bool} Whether this frame trimmed or not.
        * @param actualWidth {number} Actual width of this frame.
        * @param actualHeight {number} Actual height of this frame.
        * @param destX {number} Destination x position.
        * @param destY {number} Destination y position.
        * @param destWidth {number} Destination draw width.
        * @param destHeight {number} Destination draw height.
        */
        function (trimmed, actualWidth, actualHeight, destX, destY, destWidth, destHeight) {
            //console.log('setTrim', trimmed, 'aw', actualWidth, 'ah', actualHeight, 'dx', destX, 'dy', destY, 'dw', destWidth, 'dh', destHeight);
            this.trimmed = trimmed;
            if(trimmed) {
                this.width = actualWidth;
                this.height = actualHeight;
                this.sourceSizeW = actualWidth;
                this.sourceSizeH = actualHeight;
                this.spriteSourceSizeX = destX;
                this.spriteSourceSizeY = destY;
                this.spriteSourceSizeW = destWidth;
                this.spriteSourceSizeH = destHeight;
            }
        };
        return Frame;
    })();
    Phaser.Frame = Frame;    
})(Phaser || (Phaser = {}));
