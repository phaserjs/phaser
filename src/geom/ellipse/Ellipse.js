/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
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
var Ellipse = class {

    constructor(x, y, width, height)
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
         * @type {number}
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
    }

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
    contains(x, y)
    {
        return Contains(this, x, y);
    }

    /**
     * Returns a Point object containing the coordinates of a point on the circumference of the Ellipse
     * based on the given angle normalized to the range 0 to 1. I.e. a value of 0.5 will give the point
     * at 180 degrees around the circle.
     *
     * @method Phaser.Geom.Ellipse#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} position - A value between 0 and 1, where 0 equals 0 degrees, 0.5 equals 180 degrees and 1 equals 360 around the ellipse.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 to store the return values in. If not given a Vector2 object will be created.
     *
     * @return {Phaser.Math.Vector2} A Vector2 instance containing the coordinates of the point around the ellipse.
     */
    getPoint(position, point)
    {
        return GetPoint(this, position, point);
    }

    /**
     * Returns an array of Vector2 objects containing the coordinates of the points around the circumference of the Ellipse,
     * based on the given quantity or stepRate values.
     *
     * @method Phaser.Geom.Ellipse#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2[]} O - [output,$return]
     *
     * @param {number} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
     * @param {number} [stepRate] - Sets the quantity by getting the circumference of the ellipse and dividing it by the stepRate.
     * @param {Phaser.Math.Vector2[]} [output] - An array to insert the Vector2s in. If not provided a new array will be created.
     *
     * @return {Phaser.Math.Vector2[]} An array of Vector2 objects pertaining to the points around the circumference of the ellipse.
     */
    getPoints(quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    }

    /**
     * Returns a uniformly distributed random point from anywhere within the given Ellipse.
     *
     * @method Phaser.Geom.Ellipse#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [point,$return]
     *
     * @param {Phaser.Math.Vector2} [vec] - A Vector2 object to set the random `x` and `y` values in.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object with the random values set in the `x` and `y` properties.
     */
    getRandomPoint(vec)
    {
        return Random(this, vec);
    }

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
    setTo(x, y, width, height)
    {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        return this;
    }

    /**
     * Sets this Ellipse to be empty with a width and height of zero.
     * Does not change its position.
     *
     * @method Phaser.Geom.Ellipse#setEmpty
     * @since 3.0.0
     *
     * @return {this} This Ellipse object.
     */
    setEmpty()
    {
        this.width = 0;
        this.height = 0;

        return this;
    }

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
    setPosition(x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    }

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
    setSize(width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    }

    /**
     * Checks to see if the Ellipse is empty: has a width or height equal to zero.
     *
     * @method Phaser.Geom.Ellipse#isEmpty
     * @since 3.0.0
     *
     * @return {boolean} True if the Ellipse is empty, otherwise false.
     */
    isEmpty()
    {
        return (this.width <= 0 || this.height <= 0);
    }

    /**
     * Returns the minor radius of the ellipse. Also known as the Semi Minor Axis.
     *
     * @method Phaser.Geom.Ellipse#getMinorRadius
     * @since 3.0.0
     *
     * @return {number} The minor radius.
     */
    getMinorRadius()
    {
        return Math.min(this.width, this.height) / 2;
    }

    /**
     * Returns the major radius of the ellipse. Also known as the Semi Major Axis.
     *
     * @method Phaser.Geom.Ellipse#getMajorRadius
     * @since 3.0.0
     *
     * @return {number} The major radius.
     */
    getMajorRadius()
    {
        return Math.max(this.width, this.height) / 2;
    }

    /**
     * The left position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#left
     * @type {number}
     * @since 3.0.0
     */

    get left()
    {
        return this.x - (this.width / 2);
    }

    set left(value)
    {
        this.x = value + (this.width / 2);
    }

    /**
     * The right position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#right
     * @type {number}
     * @since 3.0.0
     */

    get right()
    {
        return this.x + (this.width / 2);
    }

    set right(value)
    {
        this.x = value - (this.width / 2);
    }

    /**
     * The top position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#top
     * @type {number}
     * @since 3.0.0
     */

    get top()
    {
        return this.y - (this.height / 2);
    }

    set top(value)
    {
        this.y = value + (this.height / 2);
    }

    /**
     * The bottom position of the Ellipse.
     *
     * @name Phaser.Geom.Ellipse#bottom
     * @type {number}
     * @since 3.0.0
     */

    get bottom()
    {
        return this.y + (this.height / 2);
    }

    set bottom(value)
    {
        this.y = value - (this.height / 2);
    }

};

module.exports = Ellipse;
