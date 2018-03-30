/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for getting and setting the size of a Game Object.
 * 
 * @name Phaser.GameObjects.Components.Size
 * @since 3.0.0
 */

var Size = {

    /**
     * A property indicating that a Game Object has this component.
     * 
     * @name Phaser.GameObjects.Components.Size#_sizeComponent
     * @type {boolean}
     * @private
     * @default true
     * @since 3.2.0
     */
    _sizeComponent: true,

    /**
     * The native (un-scaled) width of this Game Object.
     * 
     * @name Phaser.GameObjects.Components.Size#width
     * @type {number}
     * @since 3.0.0
     */
    width: 0,

    /**
     * The native (un-scaled) height of this Game Object.
     * 
     * @name Phaser.GameObjects.Components.Size#height
     * @type {number}
     * @since 3.0.0
     */
    height: 0,

    /**
     * The displayed width of this Game Object.
     * This value takes into account the scale factor.
     * 
     * @name Phaser.GameObjects.Components.Size#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    displayWidth: {

        get: function ()
        {
            return this.scaleX * this.frame.realWidth;
        },

        set: function (value)
        {
            this.scaleX = value / this.frame.realWidth;
        }

    },

    /**
     * The displayed height of this Game Object.
     * This value takes into account the scale factor.
     * 
     * @name Phaser.GameObjects.Components.Size#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    displayHeight: {

        get: function ()
        {
            return this.scaleY * this.frame.realHeight;
        },

        set: function (value)
        {
            this.scaleY = value / this.frame.realHeight;
        }

    },

    /**
     * Sets the size of this Game Object to be that of the given Frame.
     * 
     * @method Phaser.GameObjects.Components.Size#setSizeToFrame
     * @since 3.0.0
     *
     * @param {Phaser.Textures.Frame} frame - The frame to base the size of this Game Object on.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setSizeToFrame: function (frame)
    {
        if (frame === undefined) { frame = this.frame; }

        this.width = frame.realWidth;
        this.height = frame.realHeight;

        return this;
    },

    /**
     * Sets the size of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.Size#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets the display size of this Game Object.
     * Calling this will adjust the scale.
     * 
     * @method Phaser.GameObjects.Components.Size#setDisplaySize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     * 
     * @return {Phaser.GameObjects.GameObject} This Game Object instance.
     */
    setDisplaySize: function (width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

};

module.exports = Size;
