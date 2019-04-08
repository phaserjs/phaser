/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArcRender = require('./ArcRender');
var Class = require('../../../utils/Class');
var DegToRad = require('../../../math/DegToRad');
var Earcut = require('../../../geom/polygon/Earcut');
var GeomCircle = require('../../../geom/circle/Circle');
var MATH_CONST = require('../../../math/const');
var Shape = require('../Shape');

/**
 * @classdesc
 * The Arc Shape is a Game Object that can be added to a Scene, Group or Container. You can
 * treat it like any other Game Object in your game, such as tweening it, scaling it, or enabling
 * it for input or physics. It provides a quick and easy way for you to render this shape in your
 * game without using a texture, while still taking advantage of being fully batched in WebGL.
 * 
 * This shape supports both fill and stroke colors.
 * 
 * When it renders it displays an arc shape. You can control the start and end angles of the arc,
 * as well as if the angles are winding clockwise or anti-clockwise. With the default settings
 * it renders as a complete circle. By changing the angles you can create other arc shapes,
 * such as half-circles.
 * 
 * Arcs also have an `iterations` property and corresponding `setIterations` method. This allows
 * you to control how smooth the shape renders in WebGL, by controlling the number of iterations
 * that take place during construction.
 *
 * @class Arc
 * @extends Phaser.GameObjects.Shape
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} [x=0] - The horizontal position of this Game Object in the world.
 * @param {number} [y=0] - The vertical position of this Game Object in the world.
 * @param {number} [radius=128] - The radius of the arc.
 * @param {integer} [startAngle=0] - The start angle of the arc, in degrees.
 * @param {integer} [endAngle=360] - The end angle of the arc, in degrees.
 * @param {boolean} [anticlockwise=false] - The winding order of the start and end angles.
 * @param {number} [fillColor] - The color the arc will be filled with, i.e. 0xff0000 for red.
 * @param {number} [fillAlpha] - The alpha the arc will be filled with. You can also set the alpha of the overall Shape using its `alpha` property.
 */
var Arc = new Class({

    Extends: Shape,

    Mixins: [
        ArcRender
    ],

    initialize:

    function Arc (scene, x, y, radius, startAngle, endAngle, anticlockwise, fillColor, fillAlpha)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }
        if (radius === undefined) { radius = 128; }
        if (startAngle === undefined) { startAngle = 0; }
        if (endAngle === undefined) { endAngle = 360; }
        if (anticlockwise === undefined) { anticlockwise = false; }

        Shape.call(this, scene, 'Arc', new GeomCircle(0, 0, radius));

        /**
         * Private internal value. Holds the start angle in degrees.
         *
         * @name Phaser.GameObjects.Arc#_startAngle
         * @type {integer}
         * @private
         * @since 3.13.0
         */
        this._startAngle = startAngle;

        /**
         * Private internal value. Holds the end angle in degrees.
         *
         * @name Phaser.GameObjects.Arc#_endAngle
         * @type {integer}
         * @private
         * @since 3.13.0
         */
        this._endAngle = endAngle;

        /**
         * Private internal value. Holds the winding order of the start and end angles.
         *
         * @name Phaser.GameObjects.Arc#_anticlockwise
         * @type {boolean}
         * @private
         * @since 3.13.0
         */
        this._anticlockwise = anticlockwise;

        /**
         * Private internal value. Holds the number of iterations used when drawing the arc.
         *
         * @name Phaser.GameObjects.Arc#_iterations
         * @type {number}
         * @default 0.01
         * @private
         * @since 3.13.0
         */
        this._iterations = 0.01;

        this.setPosition(x, y);
        this.setSize(this.geom.radius, this.geom.radius);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    /**
     * The number of iterations used when drawing the arc.
     * Increase this value for smoother arcs, at the cost of more polygons being rendered.
     * Modify this value by small amounts, such as 0.01.
     *
     * @name Phaser.GameObjects.Arc#iterations
     * @type {number}
     * @default 0.01
     * @since 3.13.0
     */
    iterations: {

        get: function ()
        {
            return this._iterations;
        },

        set: function (value)
        {
            this._iterations = value;

            this.updateData();
        }

    },

    /**
     * The radius of the arc.
     *
     * @name Phaser.GameObjects.Arc#radius
     * @type {number}
     * @since 3.13.0
     */
    radius: {

        get: function ()
        {
            return this.geom.radius;
        },

        set: function (value)
        {
            this.geom.radius = value;

            this.updateData();
        }

    },

    /**
     * The start angle of the arc, in degrees.
     *
     * @name Phaser.GameObjects.Arc#startAngle
     * @type {integer}
     * @since 3.13.0
     */
    startAngle: {

        get: function ()
        {
            return this._startAngle;
        },

        set: function (value)
        {
            this._startAngle = value;

            this.updateData();
        }

    },

    /**
     * The end angle of the arc, in degrees.
     *
     * @name Phaser.GameObjects.Arc#endAngle
     * @type {integer}
     * @since 3.13.0
     */
    endAngle: {

        get: function ()
        {
            return this._endAngle;
        },

        set: function (value)
        {
            this._endAngle = value;

            this.updateData();
        }

    },

    /**
     * The winding order of the start and end angles.
     *
     * @name Phaser.GameObjects.Arc#anticlockwise
     * @type {boolean}
     * @since 3.13.0
     */
    anticlockwise: {

        get: function ()
        {
            return this._anticlockwise;
        },

        set: function (value)
        {
            this._anticlockwise = value;

            this.updateData();
        }

    },

    /**
     * Sets the radius of the arc.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Arc#setRadius
     * @since 3.13.0
     * 
     * @param {number} value - The value to set the radius to.
     *
     * @return {this} This Game Object instance.
     */
    setRadius: function (value)
    {
        this.radius = value;

        return this;
    },

    /**
     * Sets the number of iterations used when drawing the arc.
     * Increase this value for smoother arcs, at the cost of more polygons being rendered.
     * Modify this value by small amounts, such as 0.01.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Arc#setIterations
     * @since 3.13.0
     * 
     * @param {number} value - The value to set the iterations to.
     *
     * @return {this} This Game Object instance.
     */
    setIterations: function (value)
    {
        if (value === undefined) { value = 0.01; }

        this.iterations = value;

        return this;
    },

    /**
     * Sets the starting angle of the arc, in degrees.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Arc#setStartAngle
     * @since 3.13.0
     * 
     * @param {integer} value - The value to set the starting angle to.
     *
     * @return {this} This Game Object instance.
     */
    setStartAngle: function (angle, anticlockwise)
    {
        this._startAngle = angle;

        if (anticlockwise !== undefined)
        {
            this._anticlockwise = anticlockwise;
        }

        return this.updateData();
    },

    /**
     * Sets the ending angle of the arc, in degrees.
     * This call can be chained.
     *
     * @method Phaser.GameObjects.Arc#setEndAngle
     * @since 3.13.0
     * 
     * @param {integer} value - The value to set the ending angle to.
     *
     * @return {this} This Game Object instance.
     */
    setEndAngle: function (angle, anticlockwise)
    {
        this._endAngle = angle;

        if (anticlockwise !== undefined)
        {
            this._anticlockwise = anticlockwise;
        }

        return this.updateData();
    },

    /**
     * Internal method that updates the data and path values.
     *
     * @method Phaser.GameObjects.Arc#updateData
     * @private
     * @since 3.13.0
     *
     * @return {this} This Game Object instance.
     */
    updateData: function ()
    {
        var step = this._iterations;
        var iteration = step;

        var radius = this.geom.radius;
        var startAngle = DegToRad(this._startAngle);
        var endAngle = DegToRad(this._endAngle);
        var anticlockwise = this._anticlockwise;

        var x = radius / 2;
        var y = radius / 2;

        endAngle -= startAngle;

        if (anticlockwise)
        {
            if (endAngle < -MATH_CONST.PI2)
            {
                endAngle = -MATH_CONST.PI2;
            }
            else if (endAngle > 0)
            {
                endAngle = -MATH_CONST.PI2 + endAngle % MATH_CONST.PI2;
            }
        }
        else if (endAngle > MATH_CONST.PI2)
        {
            endAngle = MATH_CONST.PI2;
        }
        else if (endAngle < 0)
        {
            endAngle = MATH_CONST.PI2 + endAngle % MATH_CONST.PI2;
        }

        var path = [ x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius ];

        var ta;

        while (iteration < 1)
        {
            ta = endAngle * iteration + startAngle;

            path.push(x + Math.cos(ta) * radius, y + Math.sin(ta) * radius);

            iteration += step;
        }

        ta = endAngle + startAngle;

        path.push(x + Math.cos(ta) * radius, y + Math.sin(ta) * radius);

        path.push(x + Math.cos(startAngle) * radius, y + Math.sin(startAngle) * radius);

        this.pathIndexes = Earcut(path);
        this.pathData = path;

        return this;
    }

});

module.exports = Arc;
