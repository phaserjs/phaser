/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the size of a Game Object.
 *
 * This component distinguishes between two size concepts. The native size (`width` and `height`)
 * is the un-scaled logical size, typically derived from the Game Object's texture frame. The
 * display size (`displayWidth` and `displayHeight`) is the actual rendered size in pixels, which
 * factors in the Game Object's scale. Setting the display size adjusts the scale automatically,
 * while setting the native size does not affect rendering directly.
 *
 * This component is mixed into Game Objects such as Sprites and Images by the Phaser Game Object
 * Factory and is not intended to be used standalone.
 *
 * @namespace Phaser.GameObjects.Components.Size
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
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayWidth` property.
     *
     * @name Phaser.GameObjects.Components.Size#width
     * @type {number}
     * @since 3.0.0
     */
    width: 0,

    /**
     * The native (un-scaled) height of this Game Object.
     *
     * Changing this value will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or use
     * the `displayHeight` property.
     *
     * @name Phaser.GameObjects.Components.Size#height
     * @type {number}
     * @since 3.0.0
     */
    height: 0,

    /**
     * The displayed width of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.Components.Size#displayWidth
     * @type {number}
     * @since 3.0.0
     */
    displayWidth: {

        get: function ()
        {
            return Math.abs(this.scaleX * this.frame.realWidth);
        },

        set: function (value)
        {
            this.scaleX = value / this.frame.realWidth;
        }

    },

    /**
     * The displayed height of this Game Object.
     *
     * This value takes into account the scale factor.
     *
     * Setting this value will adjust the Game Object's scale property.
     *
     * @name Phaser.GameObjects.Components.Size#displayHeight
     * @type {number}
     * @since 3.0.0
     */
    displayHeight: {

        get: function ()
        {
            return Math.abs(this.scaleY * this.frame.realHeight);
        },

        set: function (value)
        {
            this.scaleY = value / this.frame.realHeight;
        }

    },

    /**
     * Sets the size of this Game Object to be that of the given Frame or the current Frame.
     *
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     *
     * If you have enabled this Game Object for input with a custom hit area, changing the size of the Game Object will _not_ change the
     * size of the hit area. If you wish to do this, you should adjust the `input.hitArea` object directly.
     * If you have enabled this Game Object for input without a custom hit area, the hit area will be automatically resized to match the size of the selected Frame.
     *
     * @method Phaser.GameObjects.Components.Size#setSizeToFrame
     * @since 3.0.0
     *
     * @param {Phaser.Textures.Frame} [frame] - The frame to base the size of this Game Object on. The default is the current frame of the Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setSizeToFrame: function (frame)
    {
        if (!frame) { frame = this.frame; }

        this.width = frame.realWidth;
        this.height = frame.realHeight;

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = this.width;
            input.hitArea.height = this.height;
        }

        return this;
    },

    /**
     * Sets the internal size of this Game Object, as used for frame or physics body creation.
     *
     * This will not change the size that the Game Object is rendered in-game.
     * For that you need to either set the scale of the Game Object (`setScale`) or call the
     * `setDisplaySize` method, which is the same thing as changing the scale but allows you
     * to do so by giving pixel values.
     *
     * If you have enabled this Game Object for input, changing the size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     *
     * @method Phaser.GameObjects.Components.Size#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setSize: function (width, height)
    {
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets the display (rendered) size of this Game Object in pixels.
     *
     * Unlike `setSize`, which changes the native logical dimensions without affecting rendering,
     * this method adjusts the `scaleX` and `scaleY` properties so that the Game Object appears
     * at exactly the given pixel dimensions in-game. It is equivalent to calculating and setting
     * the scale manually, but more convenient when you want to work in pixel values directly.
     *
     * @method Phaser.GameObjects.Components.Size#setDisplaySize
     * @since 3.0.0
     *
     * @param {number} width - The width of this Game Object.
     * @param {number} height - The height of this Game Object.
     *
     * @return {this} This Game Object instance.
     */
    setDisplaySize: function (width, height)
    {
        this.displayWidth = width;
        this.displayHeight = height;

        return this;
    }

};

module.exports = Size;
