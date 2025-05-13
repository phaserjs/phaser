/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var GEOM_CONST = require('../const');
var Random = require('./Random');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * Defines a Line segment, a part of a line between two endpoints.
 *
 * @class Line
 * @memberof Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x1=0] - The x coordinate of the lines starting point.
 * @param {number} [y1=0] - The y coordinate of the lines starting point.
 * @param {number} [x2=0] - The x coordinate of the lines ending point.
 * @param {number} [y2=0] - The y coordinate of the lines ending point.
 */
var Line = class {

    constructor(x1, y1, x2, y2)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        /**
         * The geometry constant type of this object: `GEOM_CONST.LINE`.
         * Used for fast type comparisons.
         *
         * @name Phaser.Geom.Line#type
         * @type {number}
         * @readonly
         * @since 3.19.0
         */
        this.type = GEOM_CONST.LINE;

        /**
         * The x coordinate of the lines starting point.
         *
         * @name Phaser.Geom.Line#x1
         * @type {number}
         * @since 3.0.0
         */
        this.x1 = x1;

        /**
         * The y coordinate of the lines starting point.
         *
         * @name Phaser.Geom.Line#y1
         * @type {number}
         * @since 3.0.0
         */
        this.y1 = y1;

        /**
         * The x coordinate of the lines ending point.
         *
         * @name Phaser.Geom.Line#x2
         * @type {number}
         * @since 3.0.0
         */
        this.x2 = x2;

        /**
         * The y coordinate of the lines ending point.
         *
         * @name Phaser.Geom.Line#y2
         * @type {number}
         * @since 3.0.0
         */
        this.y2 = y2;
    }

    /**
     * Get a point on a line that's a given percentage along its length.
     *
     * @method Phaser.Geom.Line#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [output,$return]
     *
     * @param {number} position - A value between 0 and 1, where 0 is the start, 0.5 is the middle and 1 is the end of the line.
     * @param {Phaser.Math.Vector2} [output] - An optional Vector2 object to store the coordinates of the point on the line.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object containing the coordinates of the point on the line.
     */
    getPoint(position, output)
    {
        return GetPoint(this, position, output);
    }

    /**
     * Get a number of points along a line's length.
     *
     * Provide a `quantity` to get an exact number of points along the line.
     *
     * Provide a `stepRate` to ensure a specific distance between each point on the line. Set `quantity` to `0` when
     * providing a `stepRate`.
     *
     * @method Phaser.Geom.Line#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2[]} O - [output,$return]
     *
     * @param {number} quantity - The number of points to place on the line. Set to `0` to use `stepRate` instead.
     * @param {number} [stepRate] - The distance between each point on the line. When set, `quantity` is implied and should be set to `0`.
     * @param {Phaser.Math.Vector2[]} [output] - An optional array of Vector2 objects to store the coordinates of the points on the line.
     *
     * @return {Phaser.Math.Vector2[]} An array of Vector2 objects containing the coordinates of the points on the line.
     */
    getPoints(quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    }

    /**
     * Get a random Point on the Line.
     *
     * @method Phaser.Geom.Line#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [point,$return]
     *
     * @param {Phaser.Math.Vector2} [point] - An instance of a Vector2 to be modified.
     *
     * @return {Phaser.Math.Vector2} A random point on the Line.
     */
    getRandomPoint(point)
    {
        return Random(this, point);
    }

    /**
     * Set new coordinates for the line endpoints.
     *
     * @method Phaser.Geom.Line#setTo
     * @since 3.0.0
     *
     * @param {number} [x1=0] - The x coordinate of the lines starting point.
     * @param {number} [y1=0] - The y coordinate of the lines starting point.
     * @param {number} [x2=0] - The x coordinate of the lines ending point.
     * @param {number} [y2=0] - The y coordinate of the lines ending point.
     *
     * @return {this} This Line object.
     */
    setTo(x1, y1, x2, y2)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        this.x1 = x1;
        this.y1 = y1;

        this.x2 = x2;
        this.y2 = y2;

        return this;
    }

    /**
     * Sets this Line to match the x/y coordinates of the two given Vector2Like objects.
     *
     * @method Phaser.Geom.Line#setFromObjects
     * @since 3.70.0
     *
     * @param {Phaser.Types.Math.Vector2Like} start - Any object with public `x` and `y` properties, whose values will be assigned to the x1/y1 components of this Line.
     * @param {Phaser.Types.Math.Vector2Like} end - Any object with public `x` and `y` properties, whose values will be assigned to the x2/y2 components of this Line.
     *
     * @return {this} This Line object.
     */
    setFromObjects(start, end)
    {
        this.x1 = start.x;
        this.y1 = start.y;

        this.x2 = end.x;
        this.y2 = end.y;

        return this;
    }

    /**
     * Returns a Vector2 object that corresponds to the start of this Line.
     *
     * @method Phaser.Geom.Line#getPointA
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [vec2,$return]
     *
     * @param {Phaser.Math.Vector2} [vec2] - A Vector2 object to set the results in. If `undefined` a new Vector2 will be created.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object that corresponds to the start of this Line.
     */
    getPointA(vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.set(this.x1, this.y1);

        return vec2;
    }

    /**
     * Returns a Vector2 object that corresponds to the end of this Line.
     *
     * @method Phaser.Geom.Line#getPointB
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [vec2,$return]
     *
     * @param {Phaser.Math.Vector2} [vec2] - A Vector2 object to set the results in. If `undefined` a new Vector2 will be created.
     *
     * @return {Phaser.Math.Vector2} A Vector2 object that corresponds to the end of this Line.
     */
    getPointB(vec2)
    {
        if (vec2 === undefined) { vec2 = new Vector2(); }

        vec2.set(this.x2, this.y2);

        return vec2;
    }

    /**
     * The left position of the Line.
     *
     * @name Phaser.Geom.Line#left
     * @type {number}
     * @since 3.0.0
     */

    get left()
    {
        return Math.min(this.x1, this.x2);
    }

    set left(value)
    {
        if (this.x1 <= this.x2)
        {
            this.x1 = value;
        }
        else
        {
            this.x2 = value;
        }
    }

    /**
     * The right position of the Line.
     *
     * @name Phaser.Geom.Line#right
     * @type {number}
     * @since 3.0.0
     */

    get right()
    {
        return Math.max(this.x1, this.x2);
    }

    set right(value)
    {
        if (this.x1 > this.x2)
        {
            this.x1 = value;
        }
        else
        {
            this.x2 = value;
        }
    }

    /**
     * The top position of the Line.
     *
     * @name Phaser.Geom.Line#top
     * @type {number}
     * @since 3.0.0
     */

    get top()
    {
        return Math.min(this.y1, this.y2);
    }

    set top(value)
    {
        if (this.y1 <= this.y2)
        {
            this.y1 = value;
        }
        else
        {
            this.y2 = value;
        }
    }

    /**
     * The bottom position of the Line.
     *
     * @name Phaser.Geom.Line#bottom
     * @type {number}
     * @since 3.0.0
     */

    get bottom()
    {
        return Math.max(this.y1, this.y2);
    }

    set bottom(value)
    {
        if (this.y1 > this.y2)
        {
            this.y1 = value;
        }
        else
        {
            this.y2 = value;
        }
    }

};

module.exports = Line;
