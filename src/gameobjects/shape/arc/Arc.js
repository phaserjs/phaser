/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
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
 *
 * @class Arc
 * @extends Phaser.GameObjects.Shape
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.13.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
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

        this._startAngle = startAngle;
        this._endAngle = endAngle;
        this._anticlockwise = anticlockwise;
        this._iterations = 0.01;

        this.setPosition(x, y);
        this.setSize(this.data.radius, this.data.radius);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

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

    radius: {

        get: function ()
        {
            return this.data.radius;
        },

        set: function (value)
        {
            this.data.radius = value;

            this.updateData();
        }

    },

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

    setRadius: function (value)
    {
        this.radius = value;

        return this;
    },

    setIterations: function (value)
    {
        if (value === undefined) { value = 0.01; }

        this.iterations = value;

        return this;
    },

    setStartAngle: function (angle, anticlockwise)
    {
        this._startAngle = angle;

        if (anticlockwise !== undefined)
        {
            this._anticlockwise = anticlockwise;
        }

        return this.updateData();
    },

    setEndAngle: function (angle, anticlockwise)
    {
        this._endAngle = angle;

        if (anticlockwise !== undefined)
        {
            this._anticlockwise = anticlockwise;
        }

        return this.updateData();
    },

    updateData: function ()
    {
        var step = this._iterations;
        var iteration = step;

        var radius = this.data.radius;
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
