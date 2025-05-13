/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var EllipseRender = require('./EllipseRender');
var GeomEllipse = require('../../../geom/ellipse/Ellipse');
var Shape = require('../Shape');

/**
 * @classdesc
 * The Ellipse Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * When it renders it displays an ellipse shape. You can control the width and height of the ellipse.
 * If the width and height match it will render as a circle. If the width is less than the height,
 * it will look more like an egg shape.
 *
 * The Ellipse shape also has a `smoothness` property and corresponding `setSmoothness` method.
 * This allows you to control how smooth the shape renders in WebGL, by controlling the number of iterations
 * that take place during construction. Increase and decrease the default value for smoother, or more
 * jagged, shapes.
 *
 * @class Ellipse
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [width=128] - The width of the ellipse. An ellipse with equal width and height renders as a circle.
 * @param {number} [height=128] - The height of the ellipse. An ellipse with equal width and height renders as a circle.
 * @param {number} [fillColor] - The color the ellipse will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the ellipse will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Ellipse = class extends Shape {

    static
    {
        Class.mixin(this, [
            EllipseRender
        ], false);
    }

    constructor(scene, x, y, width, height, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 128; }
        if (height === undefined) { height = 128; }

        super(scene, 'Ellipse', new GeomEllipse(width / 2, height / 2, width, height));

        /**
         * Private internal value.
         * The number of points used to draw the curve. Higher values create smoother renders at the cost of more triangles being drawn.
         *
         * @name Phaser.GameObjects.Ellipse#_smoothness
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._smoothness = 64;

        this.setPosition(x, y);

        this.width = width;
        this.height = height;

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    }

    /**
     * The smoothness of the ellipse. The number of points used when rendering it.
     * Increase this value for a smoother ellipse, at the cost of more polygons being rendered.
     *
     * @name Phaser.GameObjects.Ellipse#smoothness
     * @type {number}
     * @default 64
     * @since 3.13.0
     */

    get smoothness()
    {
        return this._smoothness;
    }

    set smoothness(value)
    {
        this._smoothness = value;

        this.updateData();
    }

    /**
     * Sets the size of the ellipse by changing the underlying geometry data, rather than scaling the object.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Ellipse#setSize
     * @since 3.13.0
     *
     * @param {number} width - The width of the ellipse.
     * @param {number} height - The height of the ellipse.
     *
     * @return {this} This Game Object instance.
     */
    setSize(width, height)
    {
        this.width = width;
        this.height = height;
        this.geom.setPosition(width / 2, height / 2);
        this.geom.setSize(width, height);

        this.updateDisplayOrigin();

        return this.updateData();
    }

    /**
     * Sets the smoothness of the ellipse. The number of points used when rendering it.
     * Increase this value for a smoother ellipse, at the cost of more polygons being rendered.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Ellipse#setSmoothness
     * @since 3.13.0
     *
     * @param {number} value - The value to set the smoothness to.
     *
     * @return {this} This Game Object instance.
     */
    setSmoothness(value)
    {
        this._smoothness = value;

        return this.updateData();
    }

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Ellipse#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData()
    {
        var path = [];
        var points = this.geom.getPoints(this._smoothness);

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        path.push(points[0].x, points[0].y);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

};

module.exports = Ellipse;
