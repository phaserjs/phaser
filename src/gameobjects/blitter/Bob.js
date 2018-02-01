var Class = require('../../utils/Class');

/**
 * [description]
 *
 * @class Bob
 * @memberOf Phaser.GameObjects.Blitter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.Blitter} blitter - [description]
 * @param {number} x - [description]
 * @param {number} y - [description]
 * @param {string|integer} frame - [description]
 * @param {boolean} visible - [description]
 */
var Bob = new Class({

    initialize:

    function Bob (blitter, x, y, frame, visible)
    {
        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#parent
         * @type {Phaser.GameObjects.Blitter}
         * @since 3.0.0
         */
        this.parent = blitter;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#x
         * @type {number}
         * @since 3.0.0
         */
        this.x = x;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#y
         * @type {number}
         * @since 3.0.0
         */
        this.y = y;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#frame
         * @type {string|integer}
         * @since 3.0.0
         */
        this.frame = frame;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#data
         * @type {object}
         * @default {}
         * @since 3.0.0
         */
        this.data = {};

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#_visible
         * @type {boolean}
         * @private
         * @since 3.0.0
         */
        this._visible = visible;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#_alpha
         * @type {number}
         * @private
         * @default 1
         * @since 3.0.0
         */
        this._alpha = 1;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#flipX
         * @type {boolean}
         * @since 3.0.0
         */
        this.flipX = false;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.Blitter.Bob#flipY
         * @type {boolean}
         * @since 3.0.0
         */
        this.flipY = false;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#setFrame
     * @since 3.0.0
     *
     * @param {[type]} frame - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    setFrame: function (frame)
    {
        if (frame === undefined)
        {
            frame = this.parent.frame;
        }
        else
        {
            frame = this.parent.texture.get(frame);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#resetFlip
     * @since 3.0.0
     * 
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    resetFlip: function ()
    {
        this.flipX = false;
        this.flipY = false;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#reset
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     * @param {[type]} frame - [description]
     * 
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    reset: function (x, y, frame)
    {
        this.x = x;
        this.y = y;
        this.frame = frame;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#setFlipX
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    setFlipX: function (value)
    {
        this.flipX = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#setFlipY
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    setFlipY: function (value)
    {
        this.flipY = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#setFlip
     * @since 3.0.0
     *
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    setFlip: function (x, y)
    {
        this.flipX = x;
        this.flipY = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#setVisible
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#setAlpha
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {Phaser.GameObjects.Blitter.Bob} This Bob Game Object.
     */
    setAlpha: function (value)
    {
        this.alpha = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.Blitter.Bob#destroy
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
     * [description]
     * 
     * @name Phaser.GameObjects.Blitter.Bob#visible
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
     * [description]
     * 
     * @name Phaser.GameObjects.Blitter.Bob#alpha
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
