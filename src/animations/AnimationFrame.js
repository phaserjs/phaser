/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @typedef {object} JSONAnimationFrame
 *
 * @property {string} key - The key of the Texture this AnimationFrame uses.
 * @property {(string|integer)} frame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @property {number} duration - Additional time (in ms) that this frame should appear for during playback.
 */

/**
 * @classdesc
 * A single frame in an Animation sequence.
 *
 * An AnimationFrame consists of a reference to the Texture it uses for rendering, references to other
 * frames in the animation, and index data. It also has the ability to fire its own `onUpdate` callback
 * and modify the animation timing.
 *
 * AnimationFrames are generated automatically by the Animation class.
 *
 * @class AnimationFrame
 * @memberOf Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {string} textureKey - The key of the Texture this AnimationFrame uses.
 * @param {(string|integer)} textureFrame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @param {integer} index - The index of this AnimationFrame within the Animation sequence.
 * @param {Phaser.Textures.Frame} frame - A reference to the Texture Frame this AnimationFrame uses for rendering.
 */
var AnimationFrame = new Class({

    initialize:

    function AnimationFrame (textureKey, textureFrame, index, frame)
    {
        /**
         * The key of the Texture this AnimationFrame uses.
         *
         * @name Phaser.Animations.AnimationFrame#textureKey
         * @type {string}
         * @since 3.0.0
         */
        this.textureKey = textureKey;

        /**
         * The key of the Frame within the Texture that this AnimationFrame uses.
         *
         * @name Phaser.Animations.AnimationFrame#textureFrame
         * @type {(string|integer)}
         * @since 3.0.0
         */
        this.textureFrame = textureFrame;

        /**
         * The index of this AnimationFrame within the Animation sequence.
         *
         * @name Phaser.Animations.AnimationFrame#index
         * @type {integer}
         * @since 3.0.0
         */
        this.index = index;

        /**
         * A reference to the Texture Frame this AnimationFrame uses for rendering.
         *
         * @name Phaser.Animations.AnimationFrame#frame
         * @type {Phaser.Textures.Frame}
         * @since 3.0.0
         */
        this.frame = frame;

        /**
         * Is this the first frame in an animation sequence?
         *
         * @name Phaser.Animations.AnimationFrame#isFirst
         * @type {boolean}
         * @default false
         * @readOnly
         * @since 3.0.0
         */
        this.isFirst = false;

        /**
         * Is this the last frame in an animation sequence?
         *
         * @name Phaser.Animations.AnimationFrame#isLast
         * @type {boolean}
         * @default false
         * @readOnly
         * @since 3.0.0
         */
        this.isLast = false;

        /**
         * A reference to the AnimationFrame that comes before this one in the animation, if any.
         *
         * @name Phaser.Animations.AnimationFrame#prevFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @readOnly
         * @since 3.0.0
         */
        this.prevFrame = null;

        /**
         * A reference to the AnimationFrame that comes after this one in the animation, if any.
         *
         * @name Phaser.Animations.AnimationFrame#nextFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @readOnly
         * @since 3.0.0
         */
        this.nextFrame = null;

        /**
         * Additional time (in ms) that this frame should appear for during playback.
         * The value is added onto the msPerFrame set by the animation.
         *
         * @name Phaser.Animations.AnimationFrame#duration
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * What % through the animation does this frame come?
         * This value is generated when the animation is created and cached here.
         *
         * @name Phaser.Animations.AnimationFrame#progress
         * @type {number}
         * @default 0
         * @readOnly
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * A frame specific callback, invoked if this frame gets displayed and the callback is set.
         *
         * @name Phaser.Animations.AnimationFrame#onUpdate
         * @type {?function}
         * @default null
         * @since 3.0.0
         */
        this.onUpdate = null;
    },

    /**
     * Generates a JavaScript object suitable for converting to JSON.
     *
     * @method Phaser.Animations.AnimationFrame#toJSON
     * @since 3.0.0
     *
     * @return {JSONAnimationFrame} The AnimationFrame data.
     */
    toJSON: function ()
    {
        return {
            key: this.textureKey,
            frame: this.textureFrame,
            duration: this.duration
        };
    },

    /**
     * Destroys this object by removing references to external resources and callbacks.
     *
     * @method Phaser.Animations.AnimationFrame#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.frame = undefined;
        this.onUpdate = undefined;
    }

});

module.exports = AnimationFrame;
