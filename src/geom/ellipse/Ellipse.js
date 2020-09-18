/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
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
 * An Ellipse object.
 *
 * This is a geometry object, containing numerical values and related methods to inspect and modify them.
 * It is not a Game Object, in that you cannot add it to the display list, and it has no texture.
 * To render an Ellipse you should look at the capabilities of the Graphics class.
 *
 * @class Ellipse
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The x position of the center of the ellipse.
 * @param {number} [y=0] - The y position of the center of the ellipse.
 * @param {number} [width=0] - The width of the ellipse.
 * @param {number} [height=0] - The height of the ellipse.
 */
var Ellipse = new Class({

    initialize:

    function Ellipse (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = 0; }

        /**
         * The geometry constant type of this object: `GEOM_CONST.ELLIPSE`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Ellipse#type
         * @type {integer}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.ELLIPSE;

        /**
         * The x position of the center of the ellipse.
         *
         * @name Phaser.Geom.Ellipse#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = x;

        /**
         * The y position of the center of the ellipse.
         *
         * @name Phaser.Geom.Ellipse#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = y;

        /**
         * The width of the ellipse.
         *
         * @name Phaser.Geom.Ellipse#width
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.width = width;

        /**
         * The height of the ellipse.
         *
         * @name Phaser.Geom.Ellipse#height
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.height = height;
    },

    /**
     * Check to see if the Ellipse contains the given x / y coordinates.
     *
     * @method Phaser.Geom.Ellipse#contains
     * @since 3.0.0
     *
     * @param {number} x - The x coordinate to check within the ellipse.
     * @param {number} y - The y coordinate to check within the ellipse.
     *
     * @return {boolean} True if the coordinates are within the ellipse, otherwise false.
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    /**
     * Returns a Point object containing the coordinates of a point on the circumference of the Ellipse
     * based on the given angle normalized to the range 0 to 1. I.e. a value of 0.5 will give the point
     * at 180 degrees around the circle.
     *
     * @method Phaser.Geom.Ellipse#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [out,$return]
     *
     * @param {number} position - A value between 0 and 1, where 0 equals 0 degrees, 0.5 equals 180 degrees and 1 equals 360 around the ellipse.
     * @param {(Phaser.Geom.Point|object)} [out] - An object to store the return values in. If not given a Point object will be created.
     *
     * @return {(Phaser.Geom.Point|object)} A Point, or point-like object, containing the coordinates of the point around the ellipse.
     */
    getPoint: function (position, point)
    {
        return GetPoint(this, position, point);
    },

    /**
     * Returns an array of Point objects containing the coordinates of the points around the circumference of the Ellipse,
     * based on the given quantity or stepRate values.
     *
     * @method Phaser.Geom.Ellipse#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
     *
     * @param {integer} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
     * @param {number} [stepRate] - Sets the quantity by getting the circumference of the ellipse and dividing it by the stepRate.
     * @param {(array|Phaser.Geom.Point[])} [output] - An array to insert the points in to. If not provided a new array will be created.
     *
     * @return {(array|Phaser.Geom.Point[])} An array of Point objects pertaining to the points around the circumference of the ellipse.
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * Returns a uniformly distributed random point from anywhere within the given Ellipse.
     *
     * @method Phaser.Geom.Ellipse#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [point,$return]
     *
     * @param {(Phaser.Geom.Point|object)} [point] - A Point or point-like object to set the random `x` and `y` values in.
     *
     * @return {(Phaser.Geom.Point|object)} A Point object with the random values set in the `x` and `y` properties.
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * Sets the x, y, width and height of this ellipse.
     *
     * @method Phaser.Geom.Ellipse#setTo
     * @since 3.0.0
     *
     * @param {number} x - The x position of the center of the ellipse.
     * @param {number} y - The y position of the center of the ellipse.
     * @param {number} width - The width of the ellipse.
     * @param {number} height - The height of the ellipse.
     *
     * @return {this} This Ellipse object.
     */
    setTo: function (x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Sets this Ellipse to be empty with a width and height of zero.
     * Does not change its position.
     *
     * @method Phaser.Geom.Ellipse#setEmpty
     * @since 3.0.0
     *
     * @return {this} This Ellipse object.
     */
    setEmpty: function ()
    {
        this.width = 0;
        this.height = 0;

        return this;
    },

    /**
     * Sets the position of this Ellipse.
     *
     * @method Phaser.Geom.Ellipse#setPosition
     * @since 3.0.0
     *
     * @param {number} x - The x position of the center of the ellipse.
     * @param {number} y - The y position of the center of the ellipse.
     *
     * @return {this} This Ellipse object.
     */
    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * Sets the size of this Ellipse.
     * Does not change its position.
     *
     * @method Phaser.Geom.Ellipse#setSize
     * @since 3.0.0
     *
     * @param {number} width - The width of the ellipse.
     * @param {number} [height=width] - The height of the ellipse.
     *
     * @return {this} This Ellipse object.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * Checks to see if the Ellipse is empty: has a width or height equal to zero.
     *
     * @method Phaser.Geom.Ellipse#isEmpty
     * @since 3.0.0
     *
     * @return {boolean} True if the Ellipse is empty, otherwise false.
     */
    isEmpty: function ()
    {
        return (this.width <= 0 || this.height <= 0);
    },

    /**
     * Returns the minor radius of the ellipse. Also known as the Semi Minor Axis.
     *
     * @method Phaser.Geom.Ellipse#getMinorRadius
     * @since 3.0.0
     *
     * @return {number} The minor radius.
     */
    getMinorRadius: function ()
    {
        return Math.min(this.width, this.height) / 2;
    },

    /**
     * Returns the major radius of the ellipse. Also known as the Semi Major Axis.
     *
     * @method Phaser.Geom.Ellipse#getMajorRadius
     * @since 3.0.0
     *
     * @return {number} The major radius.
     */
    getMajorRadius: function ()
    {
        return Math.max(this.width, this.height) / 2;
    },

    /**
     * The left position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.x - (this.width / 2);
        },

        set: function (value)
        {
            this.x = value + (this.width / 2);
        }

    },

    /**
     * The right position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.x + (this.width / 2);
        },

        set: function (value)
        {
            this.x = value - (this.width / 2);
        }

    },

    /**
     * The top position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.y - (this.height / 2);
        },

        set: function (value)
        {
            this.y = value + (this.height / 2);
        }

    },

    /**
     * The bottom position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return this.y + (this.height / 2);
        },

        set: function (value)
        {
            this.y = value - (this.height / 2);
        }

    }

});

module.exports = Ellipse;
