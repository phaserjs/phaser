/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Clamp = require('../math/Clamp');
var Class = require('../utils/Class');

/**
 * @classdesc
 * The Size component allows you to set `width` and `height` properties and define the relationship between them.
 * 
 * The component can automatically maintain the aspect ratios between the two values, and clamp them
 * to a defined min-max range. You can also control the dominant axis. When dimensions are given to the Size component
 * that would cause it to exceed its min-max range, the dimensions are adjusted based on the dominant axis.
 *
 * @class Size
 * @memberof Phaser.Structs
 * @constructor
 * @since 3.16.0
 *
 * @param {number} [width] - The width of the Size component.
 * @param {number} [height=width] - The height of the Size component. If not given, it will use the `width`.
 * @param {boolean} [lockAspectRatio=false] - Should the aspect ratio be locked? It will be based on the given `width` and `height` arguments.
 * @param {boolean} [lockWidth=true] - Set to `true` to make the `width` the dominant axis, or `false` to make `height` the dominant axis.
 */
var Size = new Class({

    initialize:

    function Size (width, height, lockAspectRatio, lockWidth)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }
        if (lockAspectRatio === undefined) { lockAspectRatio = false; }
        if (lockWidth === undefined) { lockWidth = true; }

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
        this.ratioH = (height === 0) ? 1 : width / height;

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
        this.ratioV = (width === 0) ? 1 : height / width;

        /**
         * Set this property to lock the aspect ratios to their current values.
         * 
         * Once enabled, changing the `width` or `height` properties will automatically adjust the other based on the aspect ratio.
         *
         * @name Phaser.Structs.Size#lockAspectRatio
         * @type {boolean}
         * @since 3.16.0
         */
        this.lockAspectRatio = lockAspectRatio;

        /**
         * When scaling the Size based on the min-max range and the aspect ratio, this property controls the priority of
         * the axis. If `true` (the default) the `width` will be the dominant axis, and the height will adjust to match it. If `false`,
         * the `height` will be the dominant axis, and the `width` will adjust to match it.
         *
         * @name Phaser.Structs.Size#lockWidth
         * @type {boolean}
         * @default true
         * @since 3.16.0
         */
        this.lockWidth = lockWidth;

        /**
         * The minimum allowed width.
         *
         * @name Phaser.Structs.Size#_minWidth
         * @type {number}
         * @private
         * @since 3.16.0
         */
        this._minWidth = 0;

        /**
         * The minimum allowed height.
         *
         * @name Phaser.Structs.Size#_minHeight
         * @type {number}
         * @private
         * @since 3.16.0
         */
        this._minHeight = 0;

        /**
         * The maximum allowed width.
         *
         * @name Phaser.Structs.Size#_maxWidth
         * @type {number}
         * @private
         * @since 3.16.0
         */
        this._maxWidth = Number.MAX_VALUE;

        /**
         * The maximum allowed height.
         *
         * @name Phaser.Structs.Size#_maxHeight
         * @type {number}
         * @private
         * @since 3.16.0
         */
        this._maxHeight = Number.MAX_VALUE;
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
        this.lockAspectRatio = value;

        return this;
    },

    /**
     * Set the minimum width and height values this Size component will allow.
     * 
     * If enabled, the properties will be clamped to the min-max range, including when locked to their aspect ratios.
     * 
     * Setting this will automatically adjust both the `width` and `height` properties to ensure they are within range.
     *
     * @method Phaser.Structs.Size#setMin
     * @since 3.16.0
     *
     * @param {number} [width=0] - The minimum allowed width of the Size component.
     * @param {number} [height=width] - The minimum allowed height of the Size component. If not given, it will use the `width`.
     *
     * @return {this} This Size instance.
     */
    setMin: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        this._minWidth = width;
        this._minHeight = height;

        return this.update();
    },

    /**
     * Set the maximum width and height values this Size component will allow.
     * 
     * If enabled, the properties will be clamped to the min-max range, including when locked to their aspect ratios.
     * 
     * Setting this will automatically adjust both the `width` and `height` properties to ensure they are within range.
     *
     * @method Phaser.Structs.Size#setMax
     * @since 3.16.0
     *
     * @param {number} [width=Number.MAX_VALUE] - The maximum allowed width of the Size component.
     * @param {number} [height=width] - The maximum allowed height of the Size component. If not given, it will use the `width`.
     *
     * @return {this} This Size instance.
     */
    setMax: function (width, height)
    {
        if (width === undefined) { width = Number.MAX_VALUE; }
        if (height === undefined) { height = width; }

        this._maxWidth = width;
        this._maxHeight = height;

        return this.update();
    },

    /**
     * Calls `setSize` with the current width and height.
     * This has the effect of applying min-max clamping and axis locking to the current values.
     *
     * @method Phaser.Structs.Size#update
     * @since 3.16.0
     *
     * @return {this} This Size instance.
     */
    update: function ()
    {
        return this.setSize(this._width, this._height);
    },

    /**
     * Updates the `ratioH` and `ratioV` properties based on the current width and height.
     * 
     * They are only updated if `lockAspectRatio` is `false`.
     *
     * @method Phaser.Structs.Size#updateRatios
     * @since 3.16.0
     *
     * @return {this} This Size instance.
     */
    updateRatios: function ()
    {
        if (!this.lockAspectRatio)
        {
            this.ratioH = (this._height === 0) ? 1 : this._width / this._height;
            this.ratioV = (this._width === 0) ? 1 : this._height / this._width;
        }

        return this;
    },

    /**
     * Sets a new width for this Size component.
     * 
     * The new width is clamped to the min-max range automatically.
     * 
     * Additionally, if the aspect ratio is locked, the height will also be adjusted based on the new width.
     *
     * @method Phaser.Structs.Size#updateWidth
     * @since 3.16.0
     * 
     * @param {number} width - The new width of the Size component.
     *
     * @return {this} This Size instance.
     */
    updateWidth: function (width)
    {
        width = Clamp(width, this._minWidth, this._maxWidth);

        if (this.lockAspectRatio)
        {
            //  What's the new height?
            var height = width * this.ratioV;

            //  height takes priority
            if (!this.lockWidth)
            {
                if (height < this._minHeight)
                {
                    height = this._minHeight;
                }
                else if (height > this._maxHeight)
                {
                    height = this._maxHeight;
                }

                //  Re-adjust the width based on the dominant height
                width = height * this.ratioH;
            }
        }

        this._width = width;
        this._height = height;

        return this.updateRatios();
    },

    /**
     * Sets a new height for this Size component.
     * 
     * The new height is clamped to the min-max range automatically.
     * 
     * Additionally, if the aspect ratio is locked, the width will also be adjusted based on the new height.
     *
     * @method Phaser.Structs.Size#updateHeight
     * @since 3.16.0
     * 
     * @param {number} height - The new height of the Size component.
     *
     * @return {this} This Size instance.
     */
    updateHeight: function (height)
    {
        height = Clamp(height, this._minHeight, this._maxHeight);

        if (this.lockAspectRatio)
        {
            //  What's the new width?
            var width = height * this.ratioH;

            //  width takes priority
            if (this.lockWidth)
            {
                if (width < this._minWidth)
                {
                    width = this._minWidth;
                }
                else if (width > this._maxWidth)
                {
                    width = this._maxWidth;
                }

                //  Re-adjust the height based on the dominant width
                height = width * this.ratioV;
            }
        }

        this._width = width;
        this._height = height;

        return this.updateRatios();
    },

    /**
     * Set the width and height of this Size component, adjusting for the aspect ratio, if locked.
     *
     * @method Phaser.Structs.Size#setSize
     * @since 3.16.0
     *
     * @param {number} [width] - The width of the Size component.
     * @param {number} [height=width] - The height of the Size component. If not given, it will use the `width`.
     *
     * @return {this} This Size instance.
     */
    setSize: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        return (this.lockWidth) ? this.updateWidth(width) : this.updateHeight(height);
    },

    /**
     * The `width` and `height` are adjusted to fit inside the given dimensions, while keeping the current aspect ratio.
     * 
     * There may be some space inside the parent area which is not covered if its aspect ratio differs.
     *
     * @method Phaser.Structs.Size#fitTo
     * @since 3.16.0
     *
     * @param {number} width - The width of the Size component.
     * @param {number} height - The height of the Size component.
     *
     * @return {this} This Size instance.
     */
    fitTo: function (width, height)
    {
        //  Get the aspect ratios in case we need to expand or shrink to fit
        var newRatio = (height === 0) ? 1 : width / height;

        var newWidth = width;
        var newHeight = height;

        //  Get the larger aspect ratio of the two.
        //  If aspect ratio is 1 then no adjustment needed
        if (this.ratioH > newRatio)
        {
            newHeight = width / this.ratioH;
        }
        else if (this.ratioH < newRatio)
        {
            newWidth = height * this.ratioH;
        }

        this._width = newWidth;
        this._height = newHeight;

        this.ratioH = (this._height === 0) ? 1 : this._width / this._height;
        this.ratioV = (this._width === 0) ? 1 : this._height / this._width;

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
        return this.updateWidth(value);
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
        return this.updateHeight(value);
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
        return '[{ Size (width=' + this._width + ' height=' + this._height + ' ratioH=' + this.ratioH + ' ratioV=' + this.ratioV + ' lockAspectRatio=' + this.lockAspectRatio + ') }]';
    },

    /**
     * The width of this Size component.
     * 
     * This value is clamped to the range specified by `minWidth` and `maxWidth`, if enabled.
     * 
     * A width can never be less than zero.
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
            this.updateWidth(value);
        }

    },

    /**
     * The height of this Size component.
     * 
     * This value is clamped to the range specified by `minHeight` and `maxHeight`, if enabled.
     * 
     * A height can never be less than zero.
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
            this.updateHeight(value);
        }

    }

});

module.exports = Size;
