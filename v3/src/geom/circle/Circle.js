var Class = require('../../utils/Class');
var Random = require('./Random');

var Circle = new Class({

    initialize:

    /**
     * [description]
     *
     * @class Circle
     * @memberOf Phaser.Geom
     * @constructor
     * @since 3.0.0
     *
     * @param {number} [x=0] - [description]
     * @param {number} [y=0] - [description]
     * @param {number} [radius=0] - [description]
     */
    function Circle (x, y, radius)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 0; }

        /**
         * [description]
         *
         * @property {number} x
         */
        this.x = x;

        /**
         * [description]
         *
         * @property {number} y
         */
        this.y = y;

        /**
         * [description]
         *
         * @property {number} _radius
         * @private
         */
        this._radius = radius;

        /**
         * [description]
         *
         * @property {number} _diameter
         * @private
         */
        this._diameter = radius * 2;
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Circle#getRandomPoint
     *
     * @param {Phaser.Geom.Point|object} point - [description]
     *
     * @return {Phaser.Geom.Point|object} [description]
     */
    getRandomPoint: function (point)
    {
        return Random(this, point);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Circle#setTo
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} radius - [description]
     * 
     * @return {Phaser.Geom.Circle} [description]
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
     * [description]
     *
     * @method Phaser.Geom.Circle#setEmpty
     * 
     * @return {Phaser.Geom.Circle} [description]
     */
    setEmpty: function ()
    {
        return this.setTo(0, 0, 0);
    },

    /**
     * [description]
     *
     * @method Phaser.Geom.Circle#setPosition
     *
     * @param {number} x - [description]
     * @param {number} [y=x] - [description]
     * 
     * @return {Phaser.Geom.Circle} [description]
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
     * @method Phaser.Geom.Circle#isEmpty
     *
     * @return {boolean} [description]
     */
    isEmpty: function ()
    {
        return (this._radius <= 0);
    },

    /**
     * [description]
     *
     * @property {number} radius
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
     * [description]
     *
     * @property {number} diameter
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
     * [description]
     *
     * @property {number} left
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
     * [description]
     *
     * @property {number} right
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
     * [description]
     *
     * @property {number} top
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
     * [description]
     *
     * @property {number} bottom
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
