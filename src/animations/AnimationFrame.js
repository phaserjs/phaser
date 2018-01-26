var Class = require('../utils/Class');

var AnimationFrame = new Class({

    initialize:

    /**
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
     * @param {string|integer} textureFrame - The key of the Frame within the Texture that this AnimationFrame uses.
     * @param {integer} index - The index of this AnimationFrame within the Animation sequence.
     * @param {Phaser.Textures.Frame} frame - A reference to the Texture Frame this AnimationFrame uses for rendering.
     */
    function AnimationFrame (textureKey, textureFrame, index, frame)
    {
        /**
         * The key of the Texture this AnimationFrame uses.
         *
         * @property {string} textureKey
         * @since 3.0.0
         */
        this.textureKey = textureKey;

        /**
         * The key of the Frame within the Texture that this AnimationFrame uses.
         *
         * @property {string|integer} textureFrame
         * @since 3.0.0
         */
        this.textureFrame = textureFrame;

        /**
         * The index of this AnimationFrame within the Animation sequence.
         *
         * @property {integer} index
         * @since 3.0.0
         */
        this.index = index;

        /**
         * A reference to the Texture Frame this AnimationFrame uses for rendering.
         *
         * @property {Phaser.Textures.Frame} frame
         * @since 3.0.0
         */
        this.frame = frame;

        /**
         * Is this the first frame in an animation sequence?
         *
         * @property {boolean} isFirst
         * @default false
         * @readOnly
         * @since 3.0.0
         */
        this.isFirst = false;

        /**
         * Is this the last frame in an animation sequence?
         *
         * @property {boolean} isLast
         * @default false
         * @readOnly
         * @since 3.0.0
         */
        this.isLast = false;

        /**
         * A reference to the AnimationFrame that comes before this one in the animation, if any.
         *
         * @property {?Phaser.Animations.AnimationFrame} prevFrame
         * @default null
         * @readOnly
         * @since 3.0.0
         */
        this.prevFrame = null;

        /**
         * A reference to the AnimationFrame that comes after this one in the animation, if any.
         *
         * @property {?Phaser.Animations.AnimationFrame} nextFrame
         * @default null
         * @readOnly
         * @since 3.0.0
         */
        this.nextFrame = null;

        /**
         * Additional time (in ms) that this frame should appear for during playback.
         * The value is added onto the msPerFrame set by the animation.
         *
         * @property {number} duration
         * @default 0
         * @since 3.0.0
         */
        this.duration = 0;

        /**
         * What % through the animation does this frame come?
         * This value is generated when the animation is created and cached here.
         *
         * @property {number} progress
         * @default 0
         * @readOnly
         * @since 3.0.0
         */
        this.progress = 0;

        /**
         * A frame specific callback, invoked if this frame gets displayed and the callback is set.
         *
         * @property {?function} onUpdate
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
     * @return {object} The AnimationFrame data.
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
