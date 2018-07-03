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
 * A triangle is a plane created by connecting three points.
 * The first two arguments specify the first point, the middle two arguments
 * specify the second point, and the last two arguments specify the third point.
 *
 * @class Triangle
 * @memberOf Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x1=0] - [description]
 * @param {number} [y1=0] - [description]
 * @param {number} [x2=0] - [description]
 * @param {number} [y2=0] - [description]
 * @param {number} [x3=0] - [description]
 * @param {number} [y3=0] - [description]
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
         * [description]
         *
         * @name Phaser.Geom.Triangle#x1
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x1 = x1;

        /**
         * [description]
         *
         * @name Phaser.Geom.Triangle#y1
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y1 = y1;

        /**
         * [description]
         *
         * @name Phaser.Geom.Triangle#x2
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x2 = x2;

        /**
         * [description]
         *
         * @name Phaser.Geom.Triangle#y2
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y2 = y2;

        /**
         * [description]
         *
         * @name Phaser.Geom.Triangle#x3
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.x3 = x3;

        /**
         * [description]
         *
         * @name Phaser.Geom.Triangle#y3
         * @type {number}
         * @default 0
         * @since 3.0.0
         */
        this.y3 = y3;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Triangle#contains
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
     * @method Phaser.Geom.Triangle#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [output,$return]
     *
     * @param {number} position - [description]
     * @param {(Phaser.Geom.Point|object)} [output] - [description]
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
     * @method Phaser.Geom.Triangle#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point[]} O - [output,$return]
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
     * @method Phaser.Geom.Triangle#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Geom.Point} O - [point,$return]
     *
     * @param {Phaser.Geom.Point} [point] - [description]
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
     * @method Phaser.Geom.Triangle#setTo
     * @since 3.0.0
     *
     * @param {number} [x1=0] - [description]
     * @param {number} [y1=0] - [description]
     * @param {number} [x2=0] - [description]
     * @param {number} [y2=0] - [description]
     * @param {number} [x3=0] - [description]
     * @param {number} [y3=0] - [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
     * [description]
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
