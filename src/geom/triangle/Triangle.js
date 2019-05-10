/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Contains = require('./Contains');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var Line = require('../line/Line');
var Random = require('./Random');

/**
 * @classdesc
 * A triangle is a plane created by connecting three points.
 * The first two arguments specify the first point, the middle two arguments
 * specify the second point, and the last two arguments specify the third point.
 *
 * @class Triangle
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x1=0] - `x` coordinate of the first point.
 * @param {number} [y1=0] - `y` coordinate of the first point.
 * @param {number} [x2=0] - `x` coordinate of the second point.
 * @param {number} [y2=0] - `y` coordinate of the second point.
 * @param {number} [x3=0] - `x` coordinate of the third point.
 * @param {number} [y3=0] - `y` coordinate of the third point.
 */
var Triangle = new Class({

    initialize:

    function Triangle (x1, y1, x2, y2, x3, y3)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }
        if (x3 === undefined) { x3 = 0; }
        if (y3 === undefined) { y3 = 0; }

        /**
         * `x` coordinate of the first point.
         *
         * @name Phaser.Geom.Triangle#x1
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x1 = x1;

        /**
         * `y` coordinate of the first point.
         *
         * @name Phaser.Geom.Triangle#y1
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y1 = y1;

        /**
         * `x` coordinate of the second point.
         *
         * @name Phaser.Geom.Triangle#x2
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x2 = x2;

        /**
         * `y` coordinate of the second point.
         *
         * @name Phaser.Geom.Triangle#y2
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y2 = y2;

        /**
         * `x` coordinate of the third point.
         *
         * @name Phaser.Geom.Triangle#x3
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x3 = x3;

        /**
         * `y` coordinate of the third point.
         *
         * @name Phaser.Geom.Triangle#y3
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y3 = y3;
    },

    /**
     * Checks whether a given points lies within the triangle.
     *
     * @method Phaser.Geom.Triangle#contains
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate of the point to check.
     * @param {number} y - The y coordinate of the point to check.
     *
     * @return {boolean} `true` if the coordinate pair is within the triangle, otherwise `false`.
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    /**
     * Returns a specific point  on the triangle.
     *
     * @method Phaser.Geom.Triangle#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [output,$return]
     *
     * @param {number} position - Position as float within `0` and `1`. `0` equals the first point.
     * @param {(Phaser.Geom.Point|object)} [output] - Optional Point, or point-like object, that the calculated point will be written to.
     *
     * @return {(Phaser.Geom.Point|object)} Calculated `Point` that represents the requested position. It is the same as `output` when this parameter has been given.
     */
    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    /**
     * Calculates a list of evenly distributed points on the triangle. It is either possible to pass an amount of points to be generated (`quantity`) or the distance between two points (`stepRate`).
     *
     * @method Phaser.Geom.Triangle#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
     *
     * @param {integer} quantity - Number of points to be generated. Can be falsey when `stepRate` should be used. All points have the same distance along the triangle.
     * @param {number} [stepRate] - Distance between two points. Will only be used when `quantity` is falsey.
     * @param {(array|Phaser.Geom.Point[])} [output] - Optional Array for writing the calculated points into. Otherwise a new array will be created.
     *
     * @return {(array|Phaser.Geom.Point[])} Returns a list of calculated `Point` instances or the filled array passed as parameter `output`.
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * Returns a random point along the triangle.
     *
     * @method Phaser.Geom.Triangle#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [point,$return]
     *
     * @param {Phaser.Geom.Point} [point] - Optional `Point` that should be modified. Otherwise a new one will be created.
     *
     * @return {Phaser.Geom.Point} Random `Point`. When parameter `point` has been provided it will be returned.
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * Sets all three points of the triangle. Leaving out any coordinate sets it to be `0`.
     *
     * @method Phaser.Geom.Triangle#setTo
     * @since 3.0.0
     *
     * @param {number} [x1=0] - `x` coordinate of the first point.
     * @param {number} [y1=0] - `y` coordinate of the first point.
     * @param {number} [x2=0] - `x` coordinate of the second point.
     * @param {number} [y2=0] - `y` coordinate of the second point.
     * @param {number} [x3=0] - `x` coordinate of the third point.
     * @param {number} [y3=0] - `y` coordinate of the third point.
     *
     * @return {Phaser.Geom.Triangle} This Triangle object.
     */
    setTo: function (x1, y1, x2, y2, x3, y3)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }
        if (x3 === undefined) { x3 = 0; }
        if (y3 === undefined) { y3 = 0; }

        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;

        this.x3 = x3;
        this.y3 = y3;

        return this;
    },

    /**
     * Returns a Line object that corresponds to Line A of this Triangle.
     *
     * @method Phaser.Geom.Triangle#getLineA
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to line A of this Triangle.
     */
    getLineA: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x1, this.y1, this.x2, this.y2);

        return line;
    },

    /**
     * Returns a Line object that corresponds to Line B of this Triangle.
     *
     * @method Phaser.Geom.Triangle#getLineB
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to line B of this Triangle.
     */
    getLineB: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x2, this.y2, this.x3, this.y3);

        return line;
    },

    /**
     * Returns a Line object that corresponds to Line C of this Triangle.
     *
     * @method Phaser.Geom.Triangle#getLineC
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Line} O - [line,$return]
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to line C of this Triangle.
     */
    getLineC: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x3, this.y3, this.x1, this.y1);

        return line;
    },

    /**
     * Left most X coordinate of the triangle. Setting it moves the triangle on the X axis accordingly.
     *
     * @name Phaser.Geom.Triangle#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return Math.min(this.x1, this.x2, this.x3);
        },

        set: function (value)
        {
            var diff = 0;

            if (this.x1 <= this.x2 && this.x1 <= this.x3)
            {
                diff = this.x1 - value;
            }
            else if (this.x2 <= this.x1 && this.x2 <= this.x3)
            {
                diff = this.x2 - value;
            }
            else
            {
                diff = this.x3 - value;
            }

            this.x1 -= diff;
            this.x2 -= diff;
            this.x3 -= diff;
        }

    },

    /**
     * Right most X coordinate of the triangle. Setting it moves the triangle on the X axis accordingly.
     *
     * @name Phaser.Geom.Triangle#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return Math.max(this.x1, this.x2, this.x3);
        },

        set: function (value)
        {
            var diff = 0;

            if (this.x1 >= this.x2 && this.x1 >= this.x3)
            {
                diff = this.x1 - value;
            }
            else if (this.x2 >= this.x1 && this.x2 >= this.x3)
            {
                diff = this.x2 - value;
            }
            else
            {
                diff = this.x3 - value;
            }

            this.x1 -= diff;
            this.x2 -= diff;
            this.x3 -= diff;
        }

    },

    /**
     * Top most Y coordinate of the triangle. Setting it moves the triangle on the Y axis accordingly.
     *
     * @name Phaser.Geom.Triangle#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return Math.min(this.y1, this.y2, this.y3);
        },

        set: function (value)
        {
            var diff = 0;

            if (this.y1 <= this.y2 && this.y1 <= this.y3)
            {
                diff = this.y1 - value;
            }
            else if (this.y2 <= this.y1 && this.y2 <= this.y3)
            {
                diff = this.y2 - value;
            }
            else
            {
                diff = this.y3 - value;
            }

            this.y1 -= diff;
            this.y2 -= diff;
            this.y3 -= diff;
        }

    },

    /**
     * Bottom most Y coordinate of the triangle. Setting it moves the triangle on the Y axis accordingly.
     *
     * @name Phaser.Geom.Triangle#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return Math.max(this.y1, this.y2, this.y3);
        },

        set: function (value)
        {
            var diff = 0;

            if (this.y1 >= this.y2 && this.y1 >= this.y3)
            {
                diff = this.y1 - value;
            }
            else if (this.y2 >= this.y1 && this.y2 >= this.y3)
            {
                diff = this.y2 - value;
            }
            else
            {
                diff = this.y3 - value;
            }

            this.y1 -= diff;
            this.y2 -= diff;
            this.y3 -= diff;
        }

    }

});

module.exports = Triangle;
