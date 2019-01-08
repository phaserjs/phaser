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
     * @return {this} This Size component instance.
     */
    updateWidth: function (width)
    {
        console.log(width);

        width = Clamp(width, this._minWidth, this._maxWidth);


        //  Potential new height
        var height = width * (1 / this.aspectRatio);

        switch (this.aspectMode)
        {
            case 0:
                //  No scaling
                this._width = width;
                break;

            case 1:
                //  Width controls Height
                this._width = width;
                this._height = height;
                break;

            case 2:
                //  Height controls Width
                // this._width = Clamp(height, this._minHeight, this._maxHeight) * this.aspectRatio;
                break;

            case 3:
                //  Fit in Parent
                this._width = width;
                this.fitTo();
                break;

            case 4:
                //  Envelope Parent
                this._width = width;
                this.envelope();
                break;
        }

        return this;
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
     * @return {this} This Size component instance.
     */
    updateHeight: function (height)
    {
        height = Clamp(height, this._minHeight, this._maxHeight);

        //  Potential new width
        var width = height * this.aspectRatio;

        switch (this.aspectMode)
        {
            case 0:
                //  No scaling
                this._height = height;
                break;

            case 1:
                //  Width controls Height
                // this._width = width;
                // this._height = Clamp(width, this._minWidth, this._maxWidth) * (1 / this.aspectRatio);
                break;

            case 2:
                //  Height controls Width
                this._width = width;
                this._height = height;
                break;

            case 3:
                //  Fit in Parent
                this._height = height;
                this.fitTo();
                break;

            case 4:
                //  Envelope Parent
                this._height = height;
                this.envelope();
                break;
        }

        return this;
    },

    /**
     * Set the width and height of this Size component, adjusting for the aspect ratio, if locked.
     *
     * @method Phaser.Structs.Size#setSize
     * @since 3.16.0
     *
     * @param {number} [width=0] - The width of the Size component.
     * @param {number} [height=width] - The height of the Size component. If not given, it will use the `width`.
     *
     * @return {this} This Size component instance.
     */
    setSize: function (width, height)
    {
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = width; }

        this.updateWidth(width);

        return this.updateHeight(height);
    },

    /**
     * The current `width` and `height` are adjusted to fit inside the given dimensions, while keeping the aspect ratio.
     * 
     * There may be some space inside the parent area which is not covered if its aspect ratio differs.
     *
     * @method Phaser.Structs.Size#fitTo
     * @since 3.16.0
     *
     * @param {number} [width] - The new width of the Size component. If not given, and a parent has been set, it will use the parent width.
     * @param {number} [height] - The new height of the Size component. If not given, and a parent has been set, it will use the parent height.
     *
     * @return {this} This Size component instance.
     */
    fitTo: function (width, height)
    {
        if (width === undefined && this._parent) { width = this._parent.width; }
        if (height === undefined && this._parent) { height = this._parent.height; }

        var newRatio = (height === 0) ? 1 : width / height;

        var newWidth = Math.min(width, this._width);
        var newHeight = Math.min(height, this._height);

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
     * The size may extend further out than the parent if the aspect ratios differ.
     *
     * @method Phaser.Structs.Size#fitTo
     * @since 3.16.0
     *
     * @param {number} [width] - The new width of the Size component. If not given, and a parent has been set, it will use the parent width.
     * @param {number} [height] - The new height of the Size component. If not given, and a parent has been set, it will use the parent height.
     *
     * @return {this} This Size component instance.
     */
    envelope: function (width, height)
    {
        if (width === undefined && this._parent) { width = this._parent.width; }
        if (height === undefined && this._parent) { height = this._parent.height; }

        var newRatio = (height === 0) ? 1 : width / height;

        var newWidth = Math.min(width, this._width);
        var newHeight = Math.min(height, this._height);

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
     * If the aspect ratio is locked, changing the width will also automatically update the height.
     *
     * @method Phaser.Structs.Size#setWidth
     * @since 3.16.0
     *
     * @param {number} width - The width of the Size component.
     *
     * @return {this} This Size component instance.
     */
    setWidth: function (value)
    {
        return this.updateWidth(value);
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
     * @return {this} This Size component instance.
     */
    setHeight: function (value)
    {
        return this.updateHeight(value);
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
