/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * A single frame in an Animation sequence.
 *
 * An AnimationFrame consists of a reference to the Texture it uses for rendering, references to other
 * frames in the animation, and index data. It also has the ability to modify the animation timing.
 *
 * AnimationFrames are generated automatically by the Animation class.
 *
 * @class AnimationFrame
 * @memberof Phaser.Animations
 * @constructor
 * @since 3.0.0
 *
 * @param {string} textureKey - The key of the Texture this AnimationFrame uses.
 * @param {(string|number)} textureFrame - The key of the Frame within the Texture that this AnimationFrame uses.
 * @param {number} index - The index of this AnimationFrame within the Animation sequence.
 * @param {Phaser.Textures.Frame} frame - A reference to the Texture Frame this AnimationFrame uses for rendering.
 * @param {boolean} [isKeyFrame=false] - Is this Frame a Keyframe within the Animation?
 */
var AnimationFrame = new Class({

    initialize:

    function AnimationFrame (textureKey, textureFrame, index, frame, isKeyFrame)
    {
        if (isKeyFrame === undefined) { isKeyFrame = false; }

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
         * @type {(string|number)}
         * @since 3.0.0
         */
        this.textureFrame = textureFrame;

        /**
         * The index of this AnimationFrame within the Animation sequence.
         *
         * @name Phaser.Animations.AnimationFrame#index
         * @type {number}
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
         * @readonly
         * @since 3.0.0
         */
        this.isFirst = false;

        /**
         * Is this the last frame in an animation sequence?
         *
         * @name Phaser.Animations.AnimationFrame#isLast
         * @type {boolean}
         * @default false
         * @readonly
         * @since 3.0.0
         */
        this.isLast = false;

        /**
         * A reference to the AnimationFrame that comes before this one in the animation, if any.
         *
         * @name Phaser.Animations.AnimationFrame#prevFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @readonly
         * @since 3.0.0
         */
        this.prevFrame = null;

        /**
         * A reference to the AnimationFrame that comes after this one in the animation, if any.
         *
         * @name Phaser.Animations.AnimationFrame#nextFrame
         * @type {?Phaser.Animations.AnimationFrame}
         * @default null
         * @readonly
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
         * @readonly
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * Is this Frame a KeyFrame within the Animation?
         *
         * @name Phaser.Animations.AnimationFrame#isKeyFrame
         * @type {boolean}
         * @since 3.50.0
         */
        this.isKeyFrame = isKeyFrame;
    },

    /**
     * Generates a JavaScript object suitable for converting to JSON.
     *
     * @method Phaser.Animations.AnimationFrame#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Animations.JSONAnimationFrame} The AnimationFrame data.
     */
    toJSON: function ()
    {
        return {
            key: this.textureKey,
            frame: this.textureFrame,
            duration: this.duration,
            keyframe: this.isKeyFrame
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
    }

});

module.exports = AnimationFrame;
