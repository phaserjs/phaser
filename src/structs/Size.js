/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');

/**
 * @classdesc
 * The Size component is a simple structure that helps you encapsulate a `width` and `height` and, if required, maintain
 * the aspect ratios between them.
 *
 * @class Size
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.16.0
 *
 * @param {number} [width] - The width of the Size component.
 * @param {number} [height=width] - The height of the Size component. If not given, it will use the `width`.
 * @param {boolean} [lockAspectRatio=false] - Should the aspect ratio between the `width` and `height` be locked?
 */
var Size = new Class({

    initialize:

    function Size (width, height, lockAspectRatio)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }
        if (lockAspectRatio === undefined) { lockAspectRatio = false; }

        /**
         * The width.
         *
         * @name Phaser.Structs.Size#_width
         * @type {number}
         * @private
         * @since 3.16.0
         */
        this._width = width;

        /**
         * The height.
         *
         * @name Phaser.Structs.Size#_height
         * @type {number}
         * @private
         * @since 3.16.0
         */
        this._height = height;

        /**
         * The proportional relationship between the width and height.
         * 
         * This property is read only and is updated automatically when either the `width` or `height` properties are changed,
         * providing the aspect ratio lock isn't enabled.
         *
         * @name Phaser.Structs.Size#ratioH
         * @type {number}
         * @readonly
         * @since 3.16.0
         */
        this.ratioH = (height === 0) ? 0 : width / height;

        /**
         * The proportional relationship between the height and width.
         * 
         * This property is read only and is updated automatically when either the `width` or `height` properties are changed,
         * providing the aspect ratio lock isn't enabled.
         *
         * @name Phaser.Structs.Size#ratioV
         * @type {number}
         * @readonly
         * @since 3.16.0
         */
        this.ratioV = (width === 0) ? 0 : height / width;

        /**
         * Lock the aspect ratio to its current value?
         * 
         * If enabled, changing the width or height properties will automatically adjust the other based on the aspect ratio.
         *
         * @name Phaser.Structs.Size#lock
         * @type {boolean}
         * @since 3.16.0
         */
        this.lock = lockAspectRatio;
    },

    /**
     * Lock the aspect ratio to its current value?
     * 
     * If enabled, changing the `width` or `height` properties will automatically adjust the other based on the aspect ratio.
     *
     * @method Phaser.Structs.Size#setAspectRatioLock
     * @since 3.16.0
     *
     * @param {boolean} value - `true` to enable the aspect ratio lock or `false` to disable it.
     *
     * @return {this} This Size instance.
     */
    setAspectRatioLock: function (value)
    {
        this.lock = value;

        return this;
    },

    /**
     * Lock the aspect ratio to its current value?
     * 
     * If enabled, changing the `width` or `height` properties will automatically adjust the other based on the aspect ratio.
     *
     * @method Phaser.Structs.Size#set
     * @since 3.16.0
     *
     * @param {number} [width] - The width of the Size component.
     * @param {number} [height=width] - The height of the Size component. If not given, it will use the `width`.
     * @param {boolean} [lockAspectRatio=false] - Should the aspect ratio between the `width` and `height` be locked?
     *
     * @return {this} This Size instance.
     */
    set: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        if (this.lock)
        {
            this._width = width * this.ratioH;
            this._height = height * this.ratioV;
        }
        else
        {
            this._width = width;
            this.height = height;
        }

        return this;
    },

    /**
     * Sets the width of this Size component.
     * 
     * If the aspect ratio is locked, changing the width will also automatically update the height.
     *
     * @method Phaser.Structs.Size#setWidth
     * @since 3.16.0
     *
     * @param {number} width - The width of the Size component.
     *
     * @return {this} This Size instance.
     */
    setWidth: function (value)
    {
        this.width = value;

        return this;
    },

    /**
     * Gets the width of this Size component.
     *
     * @method Phaser.Structs.Size#getWidth
     * @since 3.16.0
     *
     * @return {number} The width of this Size component.
     */
    getWidth: function ()
    {
        return this._width;
    },

    /**
     * Sets the height of this Size component.
     * 
     * If the aspect ratio is locked, changing the height will also automatically update the width.
     *
     * @method Phaser.Structs.Size#setHeight
     * @since 3.16.0
     *
     * @param {number} height - The height of the Size component.
     *
     * @return {this} This Size instance.
     */
    setHeight: function (value)
    {
        this.height = value;

        return this;
    },

    /**
     * Gets the height of this Size component.
     *
     * @method Phaser.Structs.Size#getHeight
     * @since 3.16.0
     *
     * @return {number} The height of this Size component.
     */
    getHeight: function ()
    {
        return this._height;
    },

    /**
     * Returns a string representation of this Size component.
     *
     * @method Phaser.Structs.Size#toString
     * @since 3.16.0
     *
     * @return {string} A string representation of this Size component.
     */
    toString: function ()
    {
        return '[{ Size (width=' + this._width + ' height=' + this._height + ' ratioH=' + this.ratioH + ' ratioV=' + this.ratioV + ' lock=' + this.lock + ') }]';
    },

    /**
     * The width.
     * 
     * Changing this value will automatically update the `height` if the aspect ratio lock is enabled.
     * You can also use the `setWidth` and `getWidth` methods.
     *
     * @name Phaser.Structs.Size#width
     * @type {number}
     * @since 3.16.0
     */
    width: {

        get: function ()
        {
            return this._width;
        },

        set: function (value)
        {
            this._width = value;

            if (this.lock)
            {
                this._height = value * this.ratioV;
            }
            else
            {
                this.ratioH = (this._height === 0) ? 0 : value / this._height;
                this.ratioV = (this._width === 0) ? 0 : this._height / value;
            }
        }

    },

    /**
     * The height.
     * 
     * Changing this value will automatically update the `width` if the aspect ratio lock is enabled.
     * You can also use the `setHeight` and `getHeight` methods.
     *
     * @name Phaser.Structs.Size#height
     * @type {number}
     * @since 3.16.0
     */
    height: {

        get: function ()
        {
            return this._height;
        },

        set: function (value)
        {
            this._height = value;

            if (this.lock)
            {
                this._width = value * this.ratioH;
            }
            else
            {
                this.ratioH = (this._height === 0) ? 0 : this._width / value;
                this.ratioV = (this._width === 0) ? 0 : value / this._width;
            }
        }

    }

});

module.exports = Size;
