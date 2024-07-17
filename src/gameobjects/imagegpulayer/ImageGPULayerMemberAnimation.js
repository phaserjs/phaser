/**
 * @author       Benjamin D. Richards <benjamindrichards@gmail.com>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var EasingEncoding = require('./EasingEncoding');

/**
 * @classdesc
 * An animation used by ImageGPULayerMember objects.
 * This is a simple animation to be stored and processed
 * in 3 values on the GPU.
 *
 * If you set the values of this animation using direct properties,
 * you must call `getEncoded` to update the encoding object.
 * It is called automatically by the `setTo` method.
 *
 * @class ImageGPULayerMemberAnimation
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.90.0
 * @param {string} [type='None'] - The type of animation this is. This should be the name of an easing function or 'None'.
 * @param {number} [amplitude=0] - The amplitude of the animation.
 * @param {number} [duration=0] - The duration of the animation, in milliseconds.
 * @param {number} [offset=0] - The offset of the animation, in milliseconds.
 * @param {boolean} [yoyo=true] - Whether the animation should 'yoyo' (reverse) after completing.
 */
var ImageGPULayerMemberAnimation = new Class({
    initialize: function ImageGPULayerMemberAnimation (type, amplitude, duration, offset, yoyo)
    {
        /**
         * The type of animation this is. This should be the name of an easing function or 'none'.
         *
         * @name Phaser.GameObjects.ImageGPULayerMemberAnimation#type
         * @type {string}
         * @since 3.90.0
         */
        this.type = type || 'None';

        /**
         * The amplitude of the animation.
         *
         * @name Phaser.GameObjects.ImageGPULayerMemberAnimation#amplitude
         * @type {number}
         * @private
         * @since 3.90.0
         */
        this.amplitude = amplitude || 0;

        /**
         * The duration of the animation, in milliseconds. Must be positive.
         *
         * @name Phaser.GameObjects.ImageGPULayerMemberAnimation#duration
         * @type {number}
         * @private
         * @since 3.90.0
         */
        this.duration = duration || 0;

        /**
         * The offset of the animation, in milliseconds.
         *
         * @name Phaser.GameObjects.ImageGPULayerMemberAnimation#offset
         * @type {number}
         * @private
         * @since 3.90.0
         */
        this.offset = offset || 0;

        /**
         * Whether the animation should 'yoyo' (reverse) after completing.
         *
         * @name Phaser.GameObjects.ImageGPULayerMemberAnimation#yoyo
         * @type {boolean}
         * @since 3.90.0
         * @default true
         */
        this.yoyo = (yoyo !== undefined) ? yoyo : true;

        /**
         * The encoded values of this animation.
         * This is used to store the animation in a format
         * that can be sent to the GPU.
         *
         * @name Phaser.GameObjects.ImageGPULayerMemberAnimation#encoding
         * @type {Float32Array}
         * @since 3.90.0
         */
        this.encoding = this.getEncoded();
    },

    /**
     * Sets the values of this animation and update the encoding.
     *
     * @method Phaser.GameObjects.ImageGPULayerMemberAnimation#setTo
     * @since 3.90.0
     * @param {string} type - The type of animation this is. This should be the name of an easing function or 'none'.
     * @param {number} [amplitude] - The amplitude of the animation.
     * @param {number} [duration] - The duration of the animation, in milliseconds. Must not be negative.
     * @param {number} [offset] - The offset of the animation, in milliseconds.
     * @param {boolean} [yoyo] - Whether the animation should 'yoyo' (reverse) after completing.
     * @return {Phaser.GameObjects.ImageGPULayerMemberAnimation} This ImageGPULayerMemberAnimation object.
     */
    setTo: function (type, amplitude, duration, offset, yoyo)
    {
        this.type = type;

        if (amplitude !== undefined)
        {
            this.amplitude = amplitude;
        }

        if (duration !== undefined)
        {
            this.duration = Math.max(duration, 0);
        }

        if (offset !== undefined)
        {
            this.offset = offset;
        }

        if (yoyo !== undefined)
        {
            this.yoyo = yoyo;
        }

        this.encoding = this.getEncoded();

        return this;
    },

    /**
     * Encodes this animation into an object for the GPU.
     * This modifies the values to encode type for the GPU.
     *
     * @method Phaser.GameObjects.ImageGPULayerMemberAnimation#getEncoded
     * @since 3.90.0
     * @return {Float32Array} The encoded animation object.
     */
    getEncoded: function ()
    {
        // Normalize offset.
        var offset = (this.offset / this.duration) % 1;
        if (offset < 0)
        {
            offset += 1;
        }

        // Add an integer to encode the type.
        var type = EasingEncoding[this.type];
        if (type === undefined)
        {
            type = 0;
        }

        // Encode yoyo in the sign of duration, which must be positive.
        var duration = this.duration;
        if (this.yoyo)
        {
            duration = -duration;
        }

        return new Float32Array([ this.amplitude, duration, offset + type ]);
    }
});

module.exports = ImageGPULayerMemberAnimation;
