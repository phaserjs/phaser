/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2022 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Contains = require('./Contains');
var GetPoints = require('./GetPoints');
var GEOM_CONST = require('../const');

/**
 * @classdesc
 * A Polygon object
 *
 * The polygon is a closed shape consists of a series of connected straight lines defined by list of ordered points.
 * Several formats are supported to define the list of points, check the setTo method for details.
 * This is a geometry object allowing you to define and inspect the shape.
 * It is not a Game Object, in that you cannot add it to the display list, and it has no texture.
 * To render a Polygon you should look at the capabilities of the Graphics class.
 *
 * @class Polygon
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {(string|number[]|Phaser.Types.Math.Vector2Like[])} [points] - List of points defining the perimeter of this Polygon. Several formats are supported:
 * - A string containing paired x y values separated by a single space: `'40 0 40 20 100 20 100 80 40 80 40 100 0 50'`
 * - An array of Point objects: `[new Phaser.Point(x1, y1), ...]`
 * - An array of objects with public x y properties: `[obj1, obj2, ...]`
 * - An array of paired numbers that represent point coordinates: `[x1,y1, x2,y2, ...]`
 * - An array of arrays with two elements representing x/y coordinates: `[[x1, y1], [x2, y2], ...]`
 */
var Polygon = new Class({

    initialize:

    function Polygon (points)
    {
        /**
         * The geometry constant type of this object: `GEOM_CONST.POLYGON`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Polygon#type
         * @type {number}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.POLYGON;

        /**
         * The area of this Polygon.
         *
         * @name Phaser.Geom.Polygon#area
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.area = 0;

        /**
         * An array of number pair objects that make up this polygon. I.e. [ {x,y}, {x,y}, {x,y} ]
         *
         * @name Phaser.Geom.Polygon#points
         * @type {Phaser.Geom.Point[]}
         * @since 3.0.0
         */
        this.points = [];

        if (points)
        {
            this.setTo(points);
        }
    },

    /**
     * Check to see if the Polygon contains the given x / y coordinates.
     *
     * @method Phaser.Geom.Polygon#contains
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to check within the polygon.
     * @param {number} y - The y coordinate to check within the polygon.
     *
     * @return {boolean} `true` if the coordinates are within the polygon, otherwise `false`.
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
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
     * `setTo` may also be called without any arguments to remove all points.
     *
     * @method Phaser.Geom.Polygon#setTo
     * @since 3.0.0
     *
     * @param {(string|number[]|Phaser.Types.Math.Vector2Like[])} [points] - Points defining the perimeter of this polygon. Please check function description above for the different supported formats.
     *
     * @return {this} This Polygon object.
     */
    setTo: function (points)
    {
        this.area = 0;
        this.points = [];

        if (typeof points === 'string')
        {
            points = points.split(' ');
        }

        if (!Array.isArray(points))
        {
            return this;
        }

        var p;
        var y0 = Number.MAX_VALUE;

        //  The points argument is an array, so iterate through it
        for (var i = 0; i < points.length; i++)
        {
            p = { x: 0, y: 0 };

            if (typeof points[i] === 'number' || typeof points[i] === 'string')
            {
                p.x = parseFloat(points[i]);
                p.y = parseFloat(points[i + 1]);
                i++;
            }
            else if (Array.isArray(points[i]))
            {
                //  An array of arrays?
                p.x = points[i][0];
                p.y = points[i][1];
            }
            else
            {
                p.x = points[i].x;
                p.y = points[i].y;
            }

            this.points.push(p);

            //  Lowest boundary
            if (p.y < y0)
            {
                y0 = p.y;
            }
        }

        this.calculateArea(y0);

        return this;
    },

    /**
     * Calculates the area of the Polygon. This is available in the property Polygon.area
     *
     * @method Phaser.Geom.Polygon#calculateArea
     * @since 3.0.0
     *
     * @return {number} The area of the polygon.
     */
    calculateArea: function ()
    {
        if (this.points.length < 3)
        {
            this.area = 0;

            return this.area;
        }

        var sum = 0;
        var p1;
        var p2;

        for (var i = 0; i < this.points.length - 1; i++)
        {
            p1 = this.points[i];
            p2 = this.points[i + 1];

            sum += (p2.x - p1.x) * (p1.y + p2.y);
        }

        p1 = this.points[0];
        p2 = this.points[this.points.length - 1];

        sum += (p1.x - p2.x) * (p2.y + p1.y);

        this.area = -sum * 0.5;

        return this.area;
    },

    /**
     * Returns an array of Point objects containing the coordinates of the points around the perimeter of the Polygon,
     * based on the given quantity or stepRate values.
     *
     * @method Phaser.Geom.Polygon#getPoints
     * @since 3.12.0
     *
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
     *
     * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
     * @param {number} [stepRate] - Sets the quantity by getting the perimeter of the Polygon and dividing it by the stepRate.
     * @param {(array|Phaser.Geom.Point[])} [output] - An array to insert the points in to. If not provided a new array will be created.
     *
     * @return {(array|Phaser.Geom.Point[])} An array of Point objects pertaining to the points around the perimeter of the Polygon.
     */
    getPoints: function (quantity, step, output)
    {
        return GetPoints(this, quantity, step, output);
    }

});

module.exports = Polygon;
