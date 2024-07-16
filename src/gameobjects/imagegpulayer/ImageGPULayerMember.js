/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A member of an ImageGPULayer.
 *
 * @class ImageGPULayerMember
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.90.0
 * @param {Phaser.GameObjects.ImageGPULayer} imageGPULayer - The ImageGPULayer that this ImageGPULayerMember belongs to.
 * @param {Phaser.Textures.Frame} frame - The texture frame of this ImageGPULayerMember.
 * @param {number} x - The horizontal position of this ImageGPULayerMember.
 * @param {number} y - The vertical position of this ImageGPULayerMember.
 */
var ImageGPULayerMember = new Class({
      
    initialize:

    function ImageGPULayerMember (imageGPULayer, frame, x, y)
    {
        /**
         * The ImageGPULayer that this ImageGPULayerMember belongs to.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#imageGPULayer
         * @type {Phaser.GameObjects.ImageGPULayer}
         * @since 3.90.0
         */
        this.imageGPULayer = imageGPULayer;

        /**
         * The texture frame of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.90.0
         */
        this.frame = frame;

        /**
         * The horizontal position of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#x
         * @type {number}
         * @since 3.90.0
         */
        this.x = x;

        /**
         * The vertical position of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#y
         * @type {number}
         * @since 3.90.0
         */
        this.y = y;

        /**
         * The rotation of this ImageGPULayerMember, in radians.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#rotation
         * @type {number}
         * @since 3.90.0
         * @default 0
         */
        this.rotation = 0;

        /**
         * The horizontal scale of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#scaleX
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.scaleX = 1;

        /**
         * The vertical scale of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#scaleY
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.scaleY = 1;

        /**
         * The horizontal origin of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#originX
         * @type {number}
         * @since 3.90.0
         * @default 0.5
         */
        this.originX = 0.5;

        /**
         * The vertical origin of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#originY
         * @type {number}
         * @since 3.90.0
         * @default 0.5
         */
        this.originY = 0.5;

        /**
         * The horizontal scroll factor of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#scrollFactorX
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.scrollFactorX = 1;

        /**
         * The vertical scroll factor of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#scrollFactorY
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.scrollFactorY = 1;

        /**
         * Whether to tint the fill of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#tintFill
         * @type {boolean}
         * @since 3.90.0
         * @default false
         */
        this.tintFill = false;

        /**
         * The blend factor of the tint of this ImageGPULayerMember.
         * A value of 0 will use pure white; a value of 1 will use the tint color.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#tintBlend
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.tintBlend = 1;

        /**
         * The bottom-left tint color of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#tintBottomLeft
         * @type {number}
         * @since 3.90.0
         * @default 0xffffff
         */
        this.tintBottomLeft = 0xffffff;

        /**
         * The top-left tint color of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#tintTopLeft
         * @type {number}
         * @since 3.90.0
         * @default 0xffffff
         */
        this.tintTopLeft = 0xffffff;

        /**
         * The bottom-right tint color of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#tintBottomRight
         * @type {number}
         * @since 3.90.0
         * @default 0xffffff
         */
        this.tintBottomRight = 0xffffff;

        /**
         * The top-right tint color of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#tintTopRight
         * @type {number}
         * @since 3.90.0
         * @default 0xffffff
         */
        this.tintTopRight = 0xffffff;

        /**
         * The bottom-left alpha of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#alphaBottomLeft
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.alphaBottomLeft = 1;

        /**
         * The top-left alpha of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#alphaTopLeft
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.alphaTopLeft = 1;

        /**
         * The bottom-right alpha of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#alphaBottomRight
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.alphaBottomRight = 1;

        /**
         * The top-right alpha of this ImageGPULayerMember.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#alphaTopRight
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.alphaTopRight = 1;

        /**
         * The alpha of this ImageGPULayerMember.
         * 0 is fully invisible, 1 is fully opaque.
         * This value multiplies the corner alpha values.
         *
         * @name Phaser.GameObjects.ImageGPULayerMember#alpha
         * @type {number}
         * @since 3.90.0
         * @default 1
         */
        this.alpha = 1;
    }
});

module.exports = ImageGPULayerMember;
