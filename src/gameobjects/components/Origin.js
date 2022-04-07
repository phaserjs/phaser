/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Provides methods used for getting and setting the origin of a Game Object.
 * Values are normalized, given in the range 0 to 1.
 * Display values contain the calculated pixel values.
 * Should be applied as a mixin and not used directly.
 *
 * @namespace Phaser.GameObjects.Components.Origin
 * @since 3.0.0
 */

var Origin = {

    /**
     * A property indicating that a Game Object has this component.
     *
     * @name Phaser.GameObjects.Components.Origin#_originComponent
     * @type {boolean}
     * @private
     * @default true
     * @since 3.2.0
     */
    _originComponent: true,

    /**
     * The horizontal origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the left of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Origin#originX
     * @type {number}
     * @default 0.5
     * @since 3.0.0
     */
    originX: 0.5,

    /**
     * The vertical origin of this Game Object.
     * The origin maps the relationship between the size and position of the Game Object.
     * The default value is 0.5, meaning all Game Objects are positioned based on their center.
     * Setting the value to 0 means the position now relates to the top of the Game Object.
     *
     * @name Phaser.GameObjects.Components.Origin#originY
     * @type {number}
     * @default 0.5
     * @since 3.0.0
     */
    originY: 0.5,

    //  private + read only
    _displayOriginX: 0,
    _displayOriginY: 0,

    /**
     * The horizontal display origin of this Game Object.
     * The origin is a normalized value between 0 and 1.
     * The displayOrigin is a pixel value, based on the size of the Game Object combined with the origin.
     *
     * @name Phaser.GameObjects.Components.Origin#displayOriginX
     * @type {number}
     * @since 3.0.0
     */
    displayOriginX: {

        get: function ()
        {
            return this._displayOriginX;
        },

        set: function (value)
        {
            this._displayOriginX = value;
            this.originX = value / this.width;
        }

    },

    /**
     * The vertical display origin of this Game Object.
     * The origin is a normalized value between 0 and 1.
     * The displayOrigin is a pixel value, based on the size of the Game Object combined with the origin.
     *
     * @name Phaser.GameObjects.Components.Origin#displayOriginY
     * @type {number}
     * @since 3.0.0
     */
    displayOriginY: {

        get: function ()
        {
            return this._displayOriginY;
        },

        set: function (value)
        {
            this._displayOriginY = value;
            this.originY = value / this.height;
        }

    },

    /**
     * Sets the origin of this Game Object.
     *
     * The values are given in the range 0 to 1.
     *
     * @method Phaser.GameObjects.Components.Origin#setOrigin
     * @since 3.0.0
     *
     * @param {number} [x=0.5] - The horizontal origin value.
     * @param {number} [y=x] - The vertical origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Game Object instance.
     */
    setOrigin: function (x, y)
    {
        if (x === undefined) { x = 0.5; }
        if (y === undefined) { y = x; }

        this.originX = x;
        this.originY = y;

        return this.updateDisplayOrigin();
    },

    /**
     * Sets the origin of this Game Object based on the Pivot values in its Frame.
     *
     * @method Phaser.GameObjects.Components.Origin#setOriginFromFrame
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    setOriginFromFrame: function ()
    {
        if (!this.frame || !this.frame.customPivot)
        {
            return this.setOrigin();
        }
        else
        {
            this.originX = this.frame.pivotX;
            this.originY = this.frame.pivotY;
        }

        return this.updateDisplayOrigin();
    },

    /**
     * Sets the display origin of this Game Object.
     * The difference between this and setting the origin is that you can use pixel values for setting the display origin.
     *
     * @method Phaser.GameObjects.Components.Origin#setDisplayOrigin
     * @since 3.0.0
     *
     * @param {number} [x=0] - The horizontal display origin value.
     * @param {number} [y=x] - The vertical display origin value. If not defined it will be set to the value of `x`.
     *
     * @return {this} This Game Object instance.
     */
    setDisplayOrigin: function (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = x; }

        this.displayOriginX = x;
        this.displayOriginY = y;

        return this;
    },

    /**
     * Updates the Display Origin cached values internally stored on this Game Object.
     * You don't usually call this directly, but it is exposed for edge-cases where you may.
     *
     * @method Phaser.GameObjects.Components.Origin#updateDisplayOrigin
     * @since 3.0.0
     *
     * @return {this} This Game Object instance.
     */
    updateDisplayOrigin: function ()
    {
        this._displayOriginX = this.originX * this.width;
        this._displayOriginY = this.originY * this.height;

        return this;
    }

};

module.exports = Origin;
