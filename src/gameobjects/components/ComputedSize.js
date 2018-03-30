/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Provides methods used for calculating and setting the size of a non-Frame based Game Object.
 * Should be applied as a mixin and not used directly.
 * 
 * @name Phaser.GameObjects.Components.ComputedSize
 * @since 3.0.0
 */

var ComputedSize = {

    /**
     * The native (un-scaled) width of this Game Object.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#width
     * @type {number}
     * @since 3.0.0
     */
    width: 0,

    /**
     * The native (un-scaled) height of this Game Object.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#height
     * @type {number}
     * @since 3.0.0
     */
    height: 0,

    /**
     * The displayed width of this Game Object.
     * This value takes into account the scale factor.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    displayWidth: {

        get: function ()
        {
            return this.scaleX * this.width;
        },

        set: function (value)
        {
            this.scaleX = value / this.width;
        }

    },

    /**
     * The displayed height of this Game Object.
     * This value takes into account the scale factor.
     * 
     * @name Phaser.GameObjects.Components.ComputedSize#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    displayHeight: {

        get: function ()
        {
            return this.scaleY * this.height;
        },

        set: function (value)
        {
            this.scaleY = value / this.height;
        }

    },

    /**
     * Sets the size of this Game Object.
     * 
     * @method Phaser.GameObjects.Components.ComputedSize#setSize
     * @since 3.4.0
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
     * @method Phaser.GameObjects.Components.ComputedSize#setDisplaySize
     * @since 3.4.0
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

module.exports = ComputedSize;
