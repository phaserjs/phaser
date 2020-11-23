/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../../utils/Class');
var CurveRender = require('./CurveRender');
var Earcut = require('../../../geom/polygon/Earcut');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var Shape = require('../Shape');

/**
 * @classdesc
 * The Curve Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports both fill and stroke colors.
 * 
 * To render a Curve Shape you must first create a `Phaser.Curves.Curve` object, then pass it to
 * the Curve Shape in the constructor.
 * 
 * The Curve shape also has a `smoothness` property and corresponding `setSmoothness` method.
 * This allows you to control how smooth the shape renders in WebGL, by controlling the number of iterations
 * that take place during construction. Increase and decrease the default value for smoother, or more
 * jagged, shapes.
 *
 * @class Curve
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {Phaser.Curves.Curve} [curve] - The Curve object to use to create the Shape.
 * @param {number} [fillColor] - The color the curve will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the curve will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Curve = new Class({

    Extends: Shape,

    Mixins: [
        CurveRender
    ],

    initialize:

    function Curve (scene, x, y, curve, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        Shape.call(this, scene, 'Curve', curve);

        /**
         * Private internal value.
         * The number of points used to draw the curve. Higher values create smoother renders at the cost of more triangles being drawn.
         *
         * @name Phaser.GameObjects.Curve#_smoothness
         * @type {number}
         * @private
         * @since 3.13.0
         */
        this._smoothness = 32;

        /**
         * Private internal value.
         * The Curve bounds rectangle.
         *
         * @name Phaser.GameObjects.Curve#_curveBounds
         * @type {Phaser.Geom.Rectangle}
         * @private
         * @since 3.13.0
         */
        this._curveBounds = new Rectangle();

        this.closePath = false;

        this.setPosition(x, y);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateData();
    },

    /**
     * The smoothness of the curve. The number of points used when rendering it.
     * Increase this value for smoother curves, at the cost of more polygons being rendered.
     *
     * @name Phaser.GameObjects.Curve#smoothness
     * @type {number}
     * @default 32
     * @since 3.13.0
     */
    smoothness: {

        get: function ()
        {
            return this._smoothness;
        },

        set: function (value)
        {
            this._smoothness = value;

            this.updateData();
        }

    },

    /**
     * Sets the smoothness of the curve. The number of points used when rendering it.
     * Increase this value for smoother curves, at the cost of more polygons being rendered.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Curve#setSmoothness
     * @since 3.13.0
     * 
     * @param {number} value - The value to set the smoothness to.
     *
     * @return {this} This Game Object instance.
     */
    setSmoothness: function (value)
    {
        this._smoothness = value;

        return this.updateData();
    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Curve#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        var bounds = this._curveBounds;
        var smoothness = this._smoothness;

        //  Update the bounds in case the underlying data has changed
        this.geom.getBounds(bounds, smoothness);

        this.setSize(bounds.width, bounds.height);
        this.updateDisplayOrigin();

        var path = [];
        var points = this.geom.getPoints(smoothness);

        for (var i = 0; i < points.length; i++)
        {
            path.push(points[i].x, points[i].y);
        }

        path.push(points[0].x, points[0].y);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Curve;
