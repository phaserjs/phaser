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

module Phaser {

    export class Frame {

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
        constructor(x: number, y: number, width: number, height: number, name: string) {

            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.name = name;

            this.rotated = false;
            this.trimmed = false;

        }

        /**
         * X position within the image to cut from.
         * @type {number}
         */
        public x: number;

        /**
         * Y position within the image to cut from.
         * @type {number}
         */
        public y: number;

        /**
         * Width of the frame.
         * @type {number}
         */
        public width: number;

        /**
         * Height of the frame.
         * @type {number}
         */
        public height: number;

        /**
         * Useful for Sprite Sheets.
         * @type {number}
         */
        public index: number;

        /**
         * Useful for Texture Atlas files. (is set to the filename value)
         */
        public name: string = '';

        /**
         * Rotated? (not yet implemented)
         */
        public rotated: bool = false;

        /**
         * Either cw or ccw, rotation is always 90 degrees.
         */
        public rotationDirection: string = 'cw';

        /**
         * Was it trimmed when packed?
         * @type {bool}
         */
        public trimmed: bool;

        //  The coordinates of the trimmed sprite inside the original sprite

        /**
         * Width of the original sprite.
         * @type {number}
         */
        public sourceSizeW: number;

        /**
         * Height of the original sprite.
         * @type {number}
         */
        public sourceSizeH: number;

        /**
         * X position of the trimmed sprite inside original sprite.
         * @type {number}
         */
        public spriteSourceSizeX: number;

        /**
         * Y position of the trimmed sprite inside original sprite.
         * @type {number}
         */
        public spriteSourceSizeY: number;

        /**
         * Width of the trimmed sprite.
         * @type {number}
         */
        public spriteSourceSizeW: number;

        /**
         * Height of the trimmed sprite.
         * @type {number}
         */
        public spriteSourceSizeH: number;

        /**
         * Set rotation of this frame. (Not yet supported!)
         */
        public setRotation(rotated: bool, rotationDirection: string) {
            //  Not yet supported
        }

        /**
         * Set trim of the frame.
         * @param trimmed {bool} Whether this frame trimmed or not.
         * @param actualWidth {number} Actual width of this frame.
         * @param actualHeight {number} Actual height of this frame.
         * @param destX {number} Destination x position.
         * @param destY {number} Destination y position.
         * @param destWidth {number} Destination draw width.
         * @param destHeight {number} Destination draw height.
         */
        public setTrim(trimmed: bool, actualWidth: number, actualHeight: number, destX: number, destY: number, destWidth: number, destHeight: number) {

            //console.log('setTrim', trimmed, 'aw', actualWidth, 'ah', actualHeight, 'dx', destX, 'dy', destY, 'dw', destWidth, 'dh', destHeight);

            this.trimmed = trimmed;

            if (trimmed)
            {
                this.width = actualWidth;
                this.height = actualHeight;
                this.sourceSizeW = actualWidth;
                this.sourceSizeH = actualHeight;
                this.spriteSourceSizeX = destX;
                this.spriteSourceSizeY = destY;
                this.spriteSourceSizeW = destWidth;
                this.spriteSourceSizeH = destHeight;
            }

        }

    }

}