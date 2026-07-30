/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Contains = require('./Contains');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var GEOM_CONST = require('../const');
var Random = require('./Random');

/**
 * @classdesc
 * A Circle geometry object defined by a center position and radius.
 *
 * This is a geometry object, containing numerical values and related methods to inspect and modify them.
 * It is not a Game Object, in that you cannot add it to the display list, and it has no texture.
 * To render a Circle you should look at the capabilities of the Graphics class.
 *
 * Circle objects are commonly used for hit-testing, overlap checks, masking, and defining circular
 * regions of interest within a Scene. They can be used directly with Phaser's geometry intersection
 * methods, such as `Phaser.Geom.Intersects.CircleToCircle` or `Phaser.Geom.Intersects.CircleToRectangle`,
 * making them useful for simple spatial queries without requiring a physics body.
 *
 * @class Circle
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The x position of the center of the circle.
 * @param {number} [y=0] - The y position of the center of the circle.
 * @param {number} [radius=0] - The radius of the circle.
 */
var Circle = new Class({

    initialize:

    function Circle (x, y, radius)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 0; }

        /**
         * The geometry constant type of this object: `GEOM_CONST.CIRCLE`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Circle#type
         * @type {number}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.CIRCLE;

        /**
         * The x position of the center of the circle.
         *
         * @name Phaser.Geom.Circle#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y position of the center of the circle.
         *
         * @name Phaser.Geom.Circle#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The internal radius of the circle.
         *
         * @name Phaser.Geom.Circle#_radius
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._radius = radius;

        /**
         * The internal diameter of the circle.
         *
         * @name Phaser.Geom.Circle#_diameter
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._diameter = radius * 2;
    },

    /**
     * Check to see if the Circle contains the given x / y coordinates.
     *
     * @method Phaser.Geom.Circle#contains
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to check within the circle.
     * @param {number} y - The y coordinate to check within the circle.
     *
     * @return {boolean} True if the coordinates are within the circle, otherwise false.
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    /**
     * Returns a Point object containing the coordinates of a point on the circumference of the Circle
     * based on the given angle normalized to the range 0 to 1. I.e. a value of 0.5 will give the point
     * at 180 degrees around the circle.
     *
     * @method Phaser.Geom.Circle#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} position - A value between 0 and 1, where 0 equals 0 degrees, 0.5 equals 180 degrees and 1 equals 360 around the circle.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 to store the return values in. If not given a Vector2 object will be created.
     *
     * @return {Phaser.Math.Vector2} A Vector2 containing the coordinates of the point around the circle.
     */
    getPoint: function (position, out)
    {
        return GetPoint(this, position, out);
    },

    /**
     * Returns an array of Point objects containing the coordinates of the points around the circumference of the Circle,
     * based on the given quantity or stepRate values.
     *
     * @method Phaser.Geom.Circle#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2[]} O - [output,$return]
     *
     * @param {number} quantity - The amount of points to return. If a falsy value the quantity will be derived from the `stepRate` instead.
     * @param {number} [stepRate] - Sets the quantity by getting the circumference of the circle and dividing it by the stepRate.
     * @param {Phaser.Math.Vector2[]} [output] - An array to insert the Vector2s in to. If not provided a new array will be created.
     *
     * @return {Phaser.Math.Vector2[]} An array of Vector2 objects pertaining to the points around the circumference of the circle.
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * Returns a uniformly distributed random point from anywhere within the Circle.
     *
     * @method Phaser.Geom.Circle#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [point,$return]
     *
     * @param {Phaser.Math.Vector2} [vec] - A Vector2 object to set the random `x` and `y` values in.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object with the random values set in the `x` and `y` properties.
     */
    getRandomPoint: function (vec)
    {
        return Random(this, vec);
    },

    /**
     * Sets the x, y and radius of this circle.
     *
     * @method Phaser.Geom.Circle#setTo
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x position of the center of the circle.
     * @param {number} [y=0] - The y position of the center of the circle.
     * @param {number} [radius=0] - The radius of the circle.
     *
     * @return {this} This Circle object.
     */
    setTo: function (x, y, radius)
    {
        this.x = x;
        this.y = y;
        this._radius = radius;
        this._diameter = radius * 2;

        return this;
    },

    /**
     * Sets this Circle to be empty with a radius of zero.
     * Does not change its position.
     *
     * @method Phaser.Geom.Circle#setEmpty
     * @since 3.0.0
     *
     * @return {this} This Circle object.
     */
    setEmpty: function ()
    {
        this._radius = 0;
        this._diameter = 0;

        return this;
    },

    /**
     * Sets the position of this Circle. If the `y` argument is omitted, both the x and y
     * positions will be set to the value of `x`.
     *
     * @method Phaser.Geom.Circle#setPosition
     * @since 3.0.0
     *
     * @param {number} [x=0] - The x position of the center of the circle.
     * @param {number} [y=0] - The y position of the center of the circle.
     *
     * @return {this} This Circle object.
     */
    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * Checks to see if the Circle is empty: has a radius of zero.
     *
     * @method Phaser.Geom.Circle#isEmpty
     * @since 3.0.0
     *
     * @return {boolean} True if the Circle is empty, otherwise false.
     */
    isEmpty: function ()
    {
        return (this._radius <= 0);
    },

    /**
     * The radius of the Circle. Setting this value also updates the diameter accordingly.
     *
     * @name Phaser.Geom.Circle#radius
     * @type {number}
     * @since 3.0.0
     */
    radius: {

        get: function ()
        {
            return this._radius;
        },

        set: function (value)
        {
            this._radius = value;
            this._diameter = value * 2;
        }

    },

    /**
     * The diameter of the Circle, which is twice the radius. Setting this value also updates the radius accordingly.
     *
     * @name Phaser.Geom.Circle#diameter
     * @type {number}
     * @since 3.0.0
     */
    diameter: {

        get: function ()
        {
            return this._diameter;
        },

        set: function (value)
        {
            this._diameter = value;
            this._radius = value * 0.5;
        }

    },

    /**
     * The leftmost point of the Circle, equal to `x - radius`. Setting this value adjusts the
     * x position of the circle's center while keeping the radius unchanged.
     *
     * @name Phaser.Geom.Circle#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.x - this._radius;
        },

        set: function (value)
        {
            this.x = value + this._radius;
        }

    },

    /**
     * The rightmost point of the Circle, equal to `x + radius`. Setting this value adjusts the
     * x position of the circle's center while keeping the radius unchanged.
     *
     * @name Phaser.Geom.Circle#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.x + this._radius;
        },

        set: function (value)
        {
            this.x = value - this._radius;
        }

    },

    /**
     * The topmost point of the Circle, equal to `y - radius`. Setting this value adjusts the
     * y position of the circle's center while keeping the radius unchanged.
     *
     * @name Phaser.Geom.Circle#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.y - this._radius;
        },

        set: function (value)
        {
            this.y = value + this._radius;
        }

    },

    /**
     * The bottommost point of the Circle, equal to `y + radius`. Setting this value adjusts the
     * y position of the circle's center while keeping the radius unchanged.
     *
     * @name Phaser.Geom.Circle#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return this.y + this._radius;
        },

        set: function (value)
        {
            this.y = value - this._radius;
        }

    }

});

module.exports = Circle;
