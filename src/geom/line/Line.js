/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var GetPoint = require('./GetPoint');
var GetPoints = require('./GetPoints');
var Random = require('./Random');

/**
 * @classdesc
 * Defines a Line segment, a part of a line between two endpoints.
 *
 * @class Line
 * @memberOf Phaser.Geom
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x1] - [description]
 * @param {number} [y1] - [description]
 * @param {number} [x2] - [description]
 * @param {number} [y2] - [description]
 */
var Line = new Class({

    initialize:

    function Line (x1, y1, x2, y2)
    {
        if (x1 === undefined) { x1 = 0; }
        if (y1 === undefined) { y1 = 0; }
        if (x2 === undefined) { x2 = 0; }
        if (y2 === undefined) { y2 = 0; }

        /**
         * [description]
         *
         * @name Phaser.Geom.Line#x1
         * @type {number}
         * @since 3.0.0
         */
        this.x1 = x1;

        /**
         * [description]
         *
         * @name Phaser.Geom.Line#y1
         * @type {number}
         * @since 3.0.0
         */
        this.y1 = y1;

        /**
         * [description]
         *
         * @name Phaser.Geom.Line#x2
         * @type {number}
         * @since 3.0.0
         */
        this.x2 = x2;

        /**
         * [description]
         *
         * @name Phaser.Geom.Line#y2
         * @type {number}
         * @since 3.0.0
         */
        this.y2 = y2;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#getPoint
     * @since 3.0.0
     *
     * @param {[type]} position - [description]
     * @param {[type]} output - [description]
     *
     * @return {Phaser.Geom.Point|object} A Point, or point-like object, containing the coordinates of the point around the ellipse.
     */
    getPoint: function (position, output)
    {
        return GetPoint(this, position, output);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#getPoints
     * @since 3.0.0
     *
     * @param {[type]} quantity - [description]
     * @param {[type]} stepRate - [description]
     * @param {[type]} output - [description]
     *
     * @return {[type]} [description]
     */
    getPoints: function (quantity, stepRate, output)
    {
        return GetPoints(this, quantity, stepRate, output);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#getRandomPoint
     * @since 3.0.0
     *
     * @param {[type]} point - [description]
     *
     * @return {[type]} [description]
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#setTo
     * @since 3.0.0
     *
     * @param {[type]} x1 - [description]
     * @param {[type]} y1 - [description]
     * @param {[type]} x2 - [description]
     * @param {[type]} y2 - [description]
     *
     * @return {Phaser.Geom.Line} This Line object.
     */
    setTo: function (x1, y1, x2, y2)
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
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#getPointA
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getPointA: function ()
    {
        return { x: this.x1, y: this.y1 };
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Line#getPointB
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    getPointB: function ()
    {
        return { x: this.x2, y: this.y2 };
    },

    /**
     * The left position of the Line.
     * 
     * @name Phaser.Geom.Line#left
     * @type {number}
     * @since 3.0.0
     */
    left: {

        get: function ()
        {
            return Math.min(this.x1, this.x2);
        },

        set: function (value)
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

    },

    /**
     * The right position of the Line.
     * 
     * @name Phaser.Geom.Line#right
     * @type {number}
     * @since 3.0.0
     */
    right: {

        get: function ()
        {
            return Math.max(this.x1, this.x2);
        },

        set: function (value)
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

    },

    /**
     * The top position of the Line.
     * 
     * @name Phaser.Geom.Line#top
     * @type {number}
     * @since 3.0.0
     */
    top: {

        get: function ()
        {
            return Math.min(this.y1, this.y2);
        },

        set: function (value)
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

    },

    /**
     * The bottom position of the Line.
     * 
     * @name Phaser.Geom.Line#bottom
     * @type {number}
     * @since 3.0.0
     */
    bottom: {

        get: function ()
        {
            return Math.max(this.y1, this.y2);
        },

        set: function (value)
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

    }

});

module.exports = Line;
