/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Contains = require('./Contains');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var Line = require('../line/Line');
var Random = require('./Random');

/**
 * @classdesc
 * Encapsulates a 2D rectangle defined by its corner point in the top-left and its extends in x (width) and y (height)
 *
 * @class Rectangle
 * @memberOf Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x] - [description]
 * @param {number} [y] - [description]
 * @param {number} [width] - [description]
 * @param {number} [height] - [description]
 */
var Rectangle = new Class({

    initialize:

    function Rectangle (x, y, width, height)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (width === undefined) { width = 0; }
        if (height === undefined) { height = 0; }

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#x
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x = x;

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#y
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y = y;

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#width
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.width = width;

        /**
         * [description]
         *
         * @name Phaser.Geom.Rectangle#height
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.height = height;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#contains
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {boolean} [description]
     */
    contains: function (x, y)
    {
        return Contains(this, x, y);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#getPoint
     * @since 3.0.0
     *
     * @param {float} position - [description]
     * @param {(Phaser.Geom.Point|object)} output - [description]
     *
     * @return {(Phaser.Geom.Point|object)} [description]
     */
    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#getPoints
     * @since 3.0.0
     *
     * @param {integer} quantity - [description]
     * @param {number} [stepRate] - [description]
     * @param {(array|Phaser.Geom.Point[])} [output] - [description]
     *
     * @return {(array|Phaser.Geom.Point[])} [description]
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#getRandomPoint
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Point} point - [description]
     *
     * @return {Phaser.Geom.Point} [description]
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
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
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setEmpty
     * @since 3.0.0
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setEmpty: function ()
    {
        return this.setTo(0, 0, 0, 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setPosition
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setPosition: function (x, y)
    {
        if (y === undefined) { y = x; }

        this.x = x;
        this.y = y;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#setSize
     * @since 3.0.0
     *
     * @param {number} width - [description]
     * @param {number} [height=width] - [description]
     *
     * @return {Phaser.Geom.Rectangle} This Rectangle object.
     */
    setSize: function (width, height)
    {
        if (height === undefined) { height = width; }

        this.width = width;
        this.height = height;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Rectangle#isEmpty
     * @since 3.0.0
     *
     * @return {boolean} [description]
     */
    isEmpty: function ()
    {
        return (this.width <= 0 || this.height <= 0);
    },

    /**
     * Returns a Line object that corresponds to the top of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineA
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the top of this Rectangle.
     */
    getLineA: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x, this.y, this.right, this.y);

        return line;
    },

    /**
     * Returns a Line object that corresponds to the right of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineB
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the right of this Rectangle.
     */
    getLineB: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.right, this.y, this.right, this.bottom);

        return line;
    },

    /**
     * Returns a Line object that corresponds to the bottom of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineC
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the bottom of this Rectangle.
     */
    getLineC: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.right, this.bottom, this.x, this.bottom);

        return line;
    },

    /**
     * Returns a Line object that corresponds to the left of this Rectangle.
     *
     * @method Phaser.Geom.Rectangle#getLineD
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Line} [line] - A Line object to set the results in. If `undefined` a new Line will be created.
     *
     * @return {Phaser.Geom.Line} A Line object that corresponds to the left of this Rectangle.
     */
    getLineD: function (line)
    {
        if (line === undefined) { line = new Line(); }

        line.setTo(this.x, this.bottom, this.x, this.y);

        return line;
    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return this.x;
        },

        set: function (value)
        {
            if (value >= this.right)
            {
                this.width = 0;
            }
            else
            {
                this.width = this.right - value;
            }

            this.x = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return this.x + this.width;
        },

        set: function (value)
        {
            if (value <= this.x)
            {
                this.width = 0;
            }
            else
            {
                this.width = value - this.x;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return this.y;
        },

        set: function (value)
        {
            if (value >= this.bottom)
            {
                this.height = 0;
            }
            else
            {
                this.height = (this.bottom - value);
            }

            this.y = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return this.y + this.height;
        },

        set: function (value)
        {
            if (value <= this.y)
            {
                this.height = 0;
            }
            else
            {
                this.height = value - this.y;
            }
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Geom.Rectangle#centerX
     * @type {number}
     * @since 3.0.0
     */
    centerX: {

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
     * [description]
     *
     * @name Phaser.Geom.Rectangle#centerY
     * @type {number}
     * @since 3.0.0
     */
    centerY: {

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

module.exports = Rectangle;
