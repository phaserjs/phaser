/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var PolygonRender = require('./PolygonRender');
var Class = require('../../../utils/Class');
var Earcut = require('../../../geom/polygon/Earcut');
var GetAABB = require('../../../geom/polygon/GetAABB');
var GeomPolygon = require('../../../geom/polygon/Polygon');
var Shape = require('../Shape');
var Smooth = require('../../../geom/polygon/Smooth');

/**
 * @classdesc
 * The Polygon Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 *
 * This shape supports both fill and stroke colors.
 *
 * The Polygon Shape is created by providing a list of points, which are then used to create an
 * internal Polygon geometry object. The points can be set from a variety of formats:
 *
 * - A string containing paired values separated by a single space: `'40 0 40 20 100 20 100 80 40 80 40 100 0 50'`
 * - An array of Point or Vector2 objects: `[new Phaser.Math.Vector2(x1, y1), ...]`
 * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
 * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
 * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
 *
 * By default the `x` and `y` coordinates of this Shape refer to the center of it. However, depending
 * on the coordinates of the points provided, the final shape may be rendered offset from its origin.
 *
 * @class Polygon
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {any} [points] - The points that make up the polygon.
 * @param {number} [fillColor] - The color the polygon will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the polygon will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Polygon = new Class({

    Extends: Shape,

    Mixins: [
        PolygonRender
    ],

    initialize:

    function Polygon (scene, x, y, points, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        Shape.call(this, scene, 'Polygon', new GeomPolygon(points));

        var bounds = GetAABB(this.geom);

        this.setPosition(x, y);
        this.setSize(bounds.width, bounds.height);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    /**
     * Smooths the polygon over the number of iterations specified.
     * The base polygon data will be updated and replaced with the smoothed values.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Polygon#smooth
     * @since 3.13.0
     *
     * @param {number} [iterations=1] - The number of times to apply the polygon smoothing.
     *
     * @return {this} This Game Object instance.
     */
    smooth: function (iterations)
    {
        if (iterations === undefined) { iterations = 1; }

        for (var i = 0; i < iterations; i++)
        {
            Smooth(this.geom);
        }

        return this.updateData();
    },

    /**
     * Sets this Polygon to the given points.
     *
     * The points can be set from a variety of formats:
     *
     * - A string containing paired values separated by a single space: `'40 0 40 20 100 20 100 80 40 80 40 100 0 50'`
     * - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
     * - An array of objects with public x/y properties: `[obj1, obj2, ...]`
     * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
     * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
     *
     * Calling this method will reset the size (width, height) and display origin of this Shape.
     *
     * It also runs both GetAABB and EarCut on the given points, so please be careful not to do this
     * at a high frequency, or with too many points.
     *
     * @method Phaser.GameObjects.Polygon#setTo
     * @since 3.60.0
     *
     * @param {(string|number[]|Phaser.Types.Math.Vector2Like[])} [points] - Points defining the perimeter of this polygon. Please check function description above for the different supported formats.
     *
     * @return {this} This Game Object instance.
     */
    setTo: function (points)
    {
        this.geom.setTo(points);

        var bounds = GetAABB(this.geom);

        this.setSize(bounds.width, bounds.height);

        this.updateDisplayOrigin();

        return this.updateData();
    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Polygon#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        var path = [];
        var points = this.geom.points;

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

module.exports = Polygon;
