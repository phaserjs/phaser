/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GeomRectangle = require('../../../geom/rectangle/Rectangle');
var Shape = require('../Shape');
var RectangleRender = require('./RectangleRender');

/**
 * @classdesc
 * The Rectangle Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * You can change the size of the rectangle by changing the `width` and `height` properties.
 *
 * @class Rectangle
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the rectangle.
 * @param {number} [height=128] - The height of the rectangle.
 * @param {number} [fillColor] - The color the rectangle will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the rectangle will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Rectangle = new Class({

    Extends: Shape,

    Mixins: [
        RectangleRender
    ],

    initialize:

    function Rectangle (scene, x, y, width, height, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        Shape.call(this, scene, 'Rectangle', new GeomRectangle(0, 0, width, height));

        /**
         * The radius of the top-left corner of the rectangle.
         *
         * Do not modify this property. Instead, call the method `setRounded` to set the
         * radius of the rounded corners.
         *
         * @name Phaser.GameObjects.Rectangle#radiusTopLeft
         * @type {number}
         * @readonly
         */
        this.radiusTopLeft = 0;

        /**
         * The radius of the top-right corner of the rectangle.
         *
         * Do not modify this property. Instead, call the method `setRounded` to set the
         * radius of the rounded corners.
         *
         * @name Phaser.GameObjects.Rectangle#radiusTopRight
         * @type {number}
         * @readonly
         */
        this.radiusTopRight = 0;

        /**
         * The radius of the bottom-left corner of the rectangle.
         *
         * Do not modify this property. Instead, call the method `setRounded` to set the
         * radius of the rounded corners.
         *
         * @name Phaser.GameObjects.Rectangle#radiusBottomLeft
         * @type {number}
         * @readonly
         */
        this.radiusBottomLeft = 0;

        /**
         * The radius of the bottom-right corner of the rectangle.
         *
         * Do not modify this property. Instead, call the method `setRounded` to set the
         * radius of the rounded corners.
         *
         * @name Phaser.GameObjects.Rectangle#radiusBottomRight
         * @type {number}
         * @readonly
         */
        this.radiusBottomRight = 0;

        this.setPosition(x, y);
        this.setSize(width, height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    /**
     * The radius of all the corners of the rectangle if this is set to use rounded corners.
     * Return `radiusTopLeft` when read this radius property.
     *
     * @name Phaser.GameObjects.Shape#radius
     * @type {number}
     * @since 3.90.0
     */
    radius: {

        get: function ()
        {
            return this.radiusTopLeft;
        },

        set: function (value)
        {
            this.setRounded(value, value, value, value);
        }

    },

    /**
     * Does this Rectangle have rounded corners?
     *
     * It checks to see if the 4 radius properties are set to 0.
     * This indicates that a Rectangle isn't rounded.
     *
     * @name Phaser.GameObjects.Shape#isRounded
     * @type {boolean}
     * @readonly
     * @since 3.90.0
     */
    isRounded: {

        get: function ()
        {
            return (
                this.radiusTopLeft !== 0 ||
                this.radiusTopRight !== 0 ||
                this.radiusBottomLeft !== 0 ||
                this.radiusBottomRight !== 0
            );
        }

    },

    /**
     * Sets this rectangle to have rounded corners by specifying the radius of the corner.
     *
     * The radius of the rounded corners is limited by the smallest dimension of the rectangle.
     *
     * To disable rounded corners, set the `topLeft` parameter to 0.
     *
     * @method Phaser.GameObjects.Rectangle#setRounded
     * @since 3.90.0
     *
     * @param {number} [topLeft=16] - The radius of the top-left corner. If no other values are given this value is applied evenly, setting all corners to this radius.
     * @param {number} [topRight] - The radius of the top-right corner.
     * @param {number} [bottomLeft] - The radius of the bottom-left corner.
     * @param {number} [bottomRight] - The radius of the bottom-right corner.
     *
     * @return {this} This Game Object instance.
     */
    setRounded: function (topLeft, topRight, bottomLeft, bottomRight)
    {
        if (topLeft === undefined) { topLeft = 16; }

        if (topRight === undefined)
        {
            topRight = topLeft;
            bottomLeft = topLeft;
            bottomRight = topLeft;
        }

        this.radiusTopLeft = topLeft;
        this.radiusTopRight = topRight;
        this.radiusBottomLeft = bottomLeft;
        this.radiusBottomRight = bottomRight;

        return this.updateRoundedData();
    },

    /**
     * Sets the internal size of this Rectangle, as used for frame or physics body creation.
     *
     * If you have assigned a custom input hit area for this Rectangle, changing the Rectangle size will _not_ change the
     * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
     *
     * @method Phaser.GameObjects.Rectangle#setSize
     * @since 3.13.0
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

        this.geom.setSize(width, height);

        this.updateData();

        this.updateDisplayOrigin();

        var input = this.input;

        if (input && !input.customHitArea)
        {
            input.hitArea.width = width;
            input.hitArea.height = height;
        }

        return this;
    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Rectangle#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        if (this.isRounded)
        {
            return this.updateRoundedData();
        }

        var path = [];
        var rect = this.geom;
        var line = this._tempLine;

        rect.getLineA(line);

        path.push(line.x1, line.y1, line.x2, line.y2);

        rect.getLineB(line);

        path.push(line.x2, line.y2);

        rect.getLineC(line);

        path.push(line.x2, line.y2);

        rect.getLineD(line);

        path.push(line.x2, line.y2);

        this.pathData = path;

        return this;
    },

    /**
     * Internal method that updates the data and path values when this rectangle is rounded.
     *
     * @method Phaser.GameObjects.Rectangle#updateRoundedData
     * @private
     * @since 3.90.0
     *
     * @return {this} This Game Object instance.
     */
    updateRoundedData: function ()
    {
        var path = [];
        var halfWidth = this.width / 2;
        var halfHeight = this.height / 2;

        //  Limit max radius to half the smallest dimension
        var maxRadius = Math.min(halfWidth, halfHeight);
        var tl = Math.min(this.radiusTopLeft, maxRadius);
        var tr = Math.min(this.radiusTopRight, maxRadius);
        var bl = Math.min(this.radiusBottomLeft, maxRadius);
        var br = Math.min(this.radiusBottomRight, maxRadius);

        var x = halfWidth;
        var y = halfHeight;

        //  Ensure minimum smoothness for small radii while preventing excessive tessellation
        var tlSegments = Math.max(4, Math.min(16, Math.ceil(tl / 2)));
        var trSegments = Math.max(4, Math.min(16, Math.ceil(tr / 2)));
        var blSegments = Math.max(4, Math.min(16, Math.ceil(bl / 2)));
        var brSegments = Math.max(4, Math.min(16, Math.ceil(br / 2)));

        //  Create points going clockwise from top-left

        //  Top-left corner
        this.arcTo(path, x - halfWidth + tl, y - halfHeight + tl, tl, Math.PI, Math.PI * 1.5, tlSegments);

        //  Top edge and top-right corner
        path.push(x + halfWidth - tr, y - halfHeight);

        this.arcTo(path, x + halfWidth - tr, y - halfHeight + tr, tr, Math.PI * 1.5, Math.PI * 2, trSegments);

        //  Right edge and bottom-right corner
        path.push(x + halfWidth, y + halfHeight - br);

        this.arcTo(path, x + halfWidth - br, y + halfHeight - br, br, 0, Math.PI * 0.5, brSegments);

        //  Bottom edge and bottom-left corner
        path.push(x - halfWidth + bl, y + halfHeight);

        this.arcTo(path, x - halfWidth + bl, y + halfHeight - bl, bl, Math.PI * 0.5, Math.PI, blSegments);

        //  Left edge (connects back to first point)
        path.push(x - halfWidth, y - halfHeight + tl);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    },

    /**
     * Internal method placing points around the circumference of a circle for the rounded corners.
     *
     * @method Phaser.GameObjects.Rectangle#arcTo
     * @private
     * @since 3.90.0
     *
     * @param {number[]} path - The array to push the points into.
     * @param {number} centerX - The center x coordinate of the circle.
     * @param {number} centerY - The center y coordinate of the circle.
     * @param {number} radius - The radius of the circle.
     * @param {number} startAngle - The starting angle of the arc.
     * @param {number} endAngle - The ending angle of the arc.
     * @param {number} segments - The number of segments to create.
     *
     * @return {this} This Game Object instance.
     */
    arcTo: function (path, centerX, centerY, radius, startAngle, endAngle, segments)
    {
        var angleInc = (endAngle - startAngle) / segments;

        for (var i = 0; i <= segments; i++)
        {
            var angle = startAngle + (angleInc * i);

            path.push(
                centerX + Math.cos(angle) * radius,
                centerY + Math.sin(angle) * radius
            );
        }
    }

});

module.exports = Rectangle;
