/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * A Bob Game Object.
 *
 * A Bob belongs to a Blitter Game Object. The Blitter is responsible for managing and rendering this object.
 *
 * A Bob has a position, alpha value and a frame from a texture that it uses to render with. You can also toggle
 * the flipped and visible state of the Bob. The Frame the Bob uses to render can be changed dynamically, but it
 * must be a Frame within the Texture used by the parent Blitter.
 *
 * Bob positions are relative to the Blitter parent. So if you move the Blitter parent, all Bob children will
 * have their positions impacted by this change as well.
 *
 * You can manipulate Bob objects directly from your game code, but the creation and destruction of them should be
 * handled via the Blitter parent.
 *
 * @class Bob
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Blitter} blitter - The parent Blitter object is responsible for updating this Bob.
 * @param {number} x - The horizontal position of this Game Object in the world, relative to the parent Blitter position.
 * @param {number} y - The vertical position of this Game Object in the world, relative to the parent Blitter position.
 * @param {(string|integer)} frame - The Frame this Bob will render with, as defined in the Texture the parent Blitter is using.
 * @param {boolean} visible - Should the Bob render visible or not to start with?
 */
var Bob = new Class({

    initialize:

    function Bob (blitter, x, y, frame, visible)
    {
        /**
         * The Blitter object that this Bob belongs to.
         *
         * @name Phaser.GameObjects.Bob#parent
         * @type {Phaser.GameObjects.Blitter}
         * @since 3.0.0
         */
        this.parent = blitter;

        /**
         * The x position of this Bob, relative to the x position of the Blitter.
         *
         * @name Phaser.GameObjects.Bob#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y position of this Bob, relative to the y position of the Blitter.
         *
         * @name Phaser.GameObjects.Bob#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The frame that the Bob uses to render with.
         * To change the frame use the `Bob.setFrame` method.
         *
         * @name Phaser.GameObjects.Bob#frame
         * @type {Phaser.Textures.Frame}
         * @protected
         * @since 3.0.0
         */
        this.frame = frame;

        /**
         * A blank object which can be used to store data related to this Bob in.
         *
         * @name Phaser.GameObjects.Bob#data
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.data = {};

        /**
         * The visible state of this Bob.
         *
         * @name Phaser.GameObjects.Bob#_visible
         * @type {boolean}
         * @private
         * @since 3.0.0
         */
        this._visible = visible;

        /**
         * The alpha value of this Bob.
         *
         * @name Phaser.GameObjects.Bob#_alpha
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._alpha = 1;

        /**
         * The horizontally flipped state of the Bob.
         * A Bob that is flipped horizontally will render inversed on the horizontal axis.
         * Flipping always takes place from the middle of the texture.
         *
         * @name Phaser.GameObjects.Bob#flipX
         * @type {boolean}
         * @since 3.0.0
         */
        this.flipX = false;

        /**
         * The vertically flipped state of the Bob.
         * A Bob that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
         * Flipping always takes place from the middle of the texture.
         *
         * @name Phaser.GameObjects.Bob#flipY
         * @type {boolean}
         * @since 3.0.0
         */
        this.flipY = false;
    },

    /**
     * Changes the Texture Frame being used by this Bob.
     * The frame must be part of the Texture the parent Blitter is using.
     * If no value is given it will use the default frame of the Blitter parent.
     *
     * @method Phaser.GameObjects.Bob#setFrame
     * @since 3.0.0
     *
     * @param {(string|integer|Phaser.Textures.Frame)} [frame] - The frame to be used during rendering.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    setFrame: function (frame)
    {
        if (frame === undefined)
        {
            this.frame = this.parent.frame;
        }
        else
        {
            this.frame = this.parent.texture.get(frame);
        }

        return this;
    },

    /**
     * Resets the horizontal and vertical flipped state of this Bob back to their default un-flipped state.
     *
     * @method Phaser.GameObjects.Bob#resetFlip
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    resetFlip: function ()
    {
        this.flipX = false;
        this.flipY = false;

        return this;
    },

    /**
     * Resets this Bob.
     *
     * Changes the position to the values given, and optionally changes the frame.
     *
     * Also resets the flipX and flipY values, sets alpha back to 1 and visible to true.
     *
     * @method Phaser.GameObjects.Bob#reset
     * @since 3.0.0
     *
     * @param {number} x - The x position of the Bob. Bob coordinate are relative to the position of the Blitter object.
     * @param {number} y - The y position of the Bob. Bob coordinate are relative to the position of the Blitter object.
     * @param {(string|integer|Phaser.Textures.Frame)} [frame] - The Frame the Bob will use. It _must_ be part of the Texture the parent Blitter object is using.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    reset: function (x, y, frame)
    {
        this.x = x;
        this.y = y;

        this.flipX = false;
        this.flipY = false;

        this._alpha = 1;
        this._visible = true;

        this.parent.dirty = true;

        if (frame)
        {
            this.setFrame(frame);
        }

        return this;
    },

    /**
     * Sets the horizontal flipped state of this Bob.
     *
     * @method Phaser.GameObjects.Bob#setFlipX
     * @since 3.0.0
     *
     * @param {boolean} value - The flipped state. `false` for no flip, or `true` to be flipped.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    setFlipX: function (value)
    {
        this.flipX = value;

        return this;
    },

    /**
     * Sets the vertical flipped state of this Bob.
     *
     * @method Phaser.GameObjects.Bob#setFlipY
     * @since 3.0.0
     *
     * @param {boolean} value - The flipped state. `false` for no flip, or `true` to be flipped.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    setFlipY: function (value)
    {
        this.flipY = value;

        return this;
    },

    /**
     * Sets the horizontal and vertical flipped state of this Bob.
     *
     * @method Phaser.GameObjects.Bob#setFlip
     * @since 3.0.0
     *
     * @param {boolean} x - The horizontal flipped state. `false` for no flip, or `true` to be flipped.
     * @param {boolean} y - The horizontal flipped state. `false` for no flip, or `true` to be flipped.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    setFlip: function (x, y)
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    },

    /**
     * Sets the visibility of this Bob.
     * 
     * An invisible Bob will skip rendering.
     *
     * @method Phaser.GameObjects.Bob#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible state of the Game Object.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    /**
     * Set the Alpha level of this Bob. The alpha controls the opacity of the Game Object as it renders.
     * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
     * 
     * A Bob with alpha 0 will skip rendering.
     *
     * @method Phaser.GameObjects.Bob#setAlpha
     * @since 3.0.0
     *
     * @param {number} value - The alpha value used for this Bob. Between 0 and 1.
     *
     * @return {Phaser.GameObjects.Bob} This Bob Game Object.
     */
    setAlpha: function (value)
    {
        this.alpha = value;

        return this;
    },

    /**
     * Destroys this Bob instance.
     * Removes itself from the Blitter and clears the parent, frame and data properties.
     *
     * @method Phaser.GameObjects.Bob#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.parent.dirty = true;

        this.parent.children.remove(this);

        this.parent = undefined;
        this.frame = undefined;
        this.data = undefined;
    },

    /**
     * The visible state of the Bob.
     * 
     * An invisible Bob will skip rendering.
     *
     * @name Phaser.GameObjects.Bob#visible
     * @type {boolean}
     * @since 3.0.0
     */
    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            this._visible = value;
            this.parent.dirty = true;
        }

    },

    /**
     * The alpha value of the Bob, between 0 and 1.
     * 
     * A Bob with alpha 0 will skip rendering.
     *
     * @name Phaser.GameObjects.Bob#alpha
     * @type {number}
     * @since 3.0.0
     */
    alpha: {

        get: function ()
        {
            return this._alpha;
        },

        set: function (value)
        {
            this._alpha = value;
            this.parent.dirty = true;
        }

    }

});

module.exports = Bob;
