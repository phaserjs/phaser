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
 */
var Size = new Class({

    initialize:

    function Size (width, height, aspectMode, parent)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }
        if (aspectMode === undefined) { aspectMode = 0; }

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

        this._parent = parent;

        //  0 = None. Do not make the rect fit the aspect ratio.
        //  1 = Width Controls Height. The height is automatically adjusted based on the width.
        //  2 = Height Controls Width. The width is automatically adjusted based on the height.
        //  3 = Fit In Parent. The width and height are automatically adjusted to make the rect fit inside the rect of the parent while keeping the aspect ratio. The may be some space inside the parent rect which is not covered by this rect.
        //  4 = Envelope Parent. The width and height are automatically adjusted to make the rect cover the entire area of the parent while keeping the aspect ratio. This rect may extend further out than the parent rect.
        this.aspectMode = aspectMode;

        /**
         * The proportional relationship between the width and height.
         * 
         * This property is read only and is updated automatically when either the `width` or `height` properties are changed,
         * providing the aspect ratio lock isn't enabled.
         *
         * @name Phaser.Structs.Size#aspectRatio
         * @type {number}
         * @readonly
         * @since 3.16.0
         */
        this.aspectRatio = (height === 0) ? 1 : width / height;

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
     * TODO
     * 
     * @method Phaser.Structs.Size#setAspectMode
     * @since 3.16.0
     *
     * @param {boolean} value - `true` to enable the aspect ratio lock or `false` to disable it.
     *
     * @return {this} This Size component instance.
     */
    setAspectMode: function (value)
    {
        this.aspectMode = value;

        return this;
    },

    setMinMax: function (minWidth, minHeight, maxWidth, maxHeight)
    {
        this.setMin(minWidth, minHeight);

        return this.setMax(maxWidth, maxHeight);
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
     * @return {this} This Size component instance.
     */
    setMin: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        this._minWidth = width;
        this._minHeight = height;

        return this.setSize(this._width, this._height);
    },

    /**
     * Set the maximum width and height values this Size component will allow.
     * 
     * Setting this will automatically adjust both the `width` and `height` properties to ensure they are within range.
     *
     * @method Phaser.Structs.Size#setMax
     * @since 3.16.0
     *
     * @param {number} [width=Number.MAX_VALUE] - The maximum allowed width of the Size component.
     * @param {number} [height=width] - The maximum allowed height of the Size component. If not given, it will use the `width`.
     *
     * @return {this} This Size component instance.
     */
    setMax: function (width, height)
    {
        if (width === undefined) { width = Number.MAX_VALUE; }
        if (height === undefined) { height = width; }

        this._maxWidth = width;
        this._maxHeight = height;

        return this.setSize(this._width, this._height);
    },

    /**
     * Sets the width and height of this Size component based on the aspect mode.
     * 
     * If the aspect mode is 'none' then calling this method will change the aspect ratio, otherwise the current
     * aspect ratio is honored across all other aspect modes.
     * 
     * If minimum and/or maximum dimensions have been specified, the values given to this method will be clamped into
     * that range prior to adjustment, but may still exceed them depending on the aspect mode.
     * 
     * If this Size component has a parent set, and the aspect mode is `fit` or `envelope`, then the given sizes will
     * be clamped to the range specified by the parent.
     *
     * @method Phaser.Structs.Size#setSize
     * @since 3.16.0
     *
     * @param {number} [width=0] - The new width of the Size component.
     * @param {number} [height=width] - The new height of the Size component. If not given, it will use the `width`.
     *
     * @return {this} This Size component instance.
     */
    setSize: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }
    
        width = Clamp(width, this._minWidth, this._maxWidth);
        height = Clamp(height, this._minHeight, this._maxHeight);

        switch (this.aspectMode)
        {
            case 0:
                this._width = width;
                this._height = height;
                this.aspectRatio = (height === 0) ? 1 : width / height;
                break;

            case 1:
                this.updateWidth(width);
                break;

            case 2:
                this.updateHeight(height);
                break;

            case 3:
                this.fitTo(width, height);
                break;

            case 4:
                this.envelope(width, height);
                break;
        }

        return this;
    },

    /**
     * The current `width` and `height` are adjusted to fit inside the given dimensions, while keeping the aspect ratio.
     * 
     * There may be some space inside the target area which is not covered if its aspect ratio differs.
     * 
     * If this Size component has a parent set, then the width and height passed to this method will be clamped so
     * it cannot exceed that of the parent.
     *
     * @method Phaser.Structs.Size#fitTo
     * @since 3.16.0
     *
     * @param {number} [width=0] - The new width of the Size component.
     * @param {number} [height] - The new height of the Size component. If not given, it will use the width value.
     *
     * @return {this} This Size component instance.
     */
    fitTo: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        var parent = this._parent;

        if (parent)
        {
            if (width > parent.width)
            {
                width = parent.width;
            }

            if (height > parent.height)
            {
                height = parent.height;
            }
        }

        var newWidth = width;
        var newHeight = height;
        var newRatio = (height === 0) ? 1 : width / height;

        if (this.aspectRatio > newRatio)
        {
            newHeight = width / this.aspectRatio;
        }
        else if (this.aspectRatio < newRatio)
        {
            newWidth = height * this.aspectRatio;
        }

        this._width = newWidth;
        this._height = newHeight;

        return this;
    },

    /**
     * The current `width` and `height` are adjusted to fit inside the given dimensions, while keeping the aspect ratio.
     * 
     * The size may extend further out than the target area if the aspect ratios differ.
     * 
     * If this Size component has a parent set, then the values are clamped so that it never exceeds the parent
     * on the longest axis.
     *
     * @method Phaser.Structs.Size#fitTo
     * @since 3.16.0
     *
     * @param {number} [width=0] - The new width of the Size component.
     * @param {number} [height] - The new height of the Size component. If not given, it will use the width value.
     *
     * @return {this} This Size component instance.
     */
    envelope: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        var parent = this._parent;

        if (parent)
        {
            if (width > parent.width)
            {
                width = parent.width;
            }

            if (height > parent.height)
            {
                height = parent.height;
            }
        }

        var newWidth = width;
        var newHeight = height;
        var newRatio = (height === 0) ? 1 : width / height;

        if (this.aspectRatio > newRatio)
        {
            newWidth = height * this.aspectRatio;
        }
        else if (this.aspectRatio < newRatio)
        {
            newHeight = width / this.aspectRatio;
        }

        this._width = newWidth;
        this._height = newHeight;

        return this;
    },

    /**
     * Sets the width of this Size component.
     * 
     * Depending on the aspect mode, changing the width may also update the height and aspect ratio.
     *
     * @method Phaser.Structs.Size#setWidth
     * @since 3.16.0
     *
     * @param {number} width - The new width of the Size component.
     *
     * @return {this} This Size component instance.
     */
    setWidth: function (value)
    {
        return this.setSize(value, this._height);
    },

    /**
     * Sets the height of this Size component.
     * 
     * Depending on the aspect mode, changing the height may also update the width and aspect ratio.
     *
     * @method Phaser.Structs.Size#setHeight
     * @since 3.16.0
     *
     * @param {number} height - The new height of the Size component.
     *
     * @return {this} This Size component instance.
     */
    setHeight: function (value)
    {
        return this.setSize(this._width, value);
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
        return '[{ Size (width=' + this._width + ' height=' + this._height + ' aspectRatio=' + this.aspectRatio + ' aspectMode=' + this.aspectMode + ') }]';
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
            this.setSize(value, this._height);
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
            this.setSize(this._width, value);
        }

    }

});

module.exports = Size;
