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
var Shape = require('../Shape');
var MATH_CONST = require('../../../math/const');

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

        this.startAngle = DegToRad(startAngle);
        this.endAngle = DegToRad(endAngle);
        this.anticlockwise = anticlockwise;
        this.iterations = 0.01;

        this.setPosition(x, y);
        this.setSize(this.data.radius, this.data.radius);

        if (fillColor !== undefined)
        {
            this.setFillStyle(fillColor, fillAlpha);
        }

        this.updateDisplayOrigin();
        this.updateData();
    },

    setSmoothing: function (value)
    {
        if (value === undefined) { value = 0.01; }

        this.iterations = value;

        return this.updateData();
    },

    setStartAngle: function (angle, anticlockwise)
    {
        this.startAngle = DegToRad(angle);

        if (anticlockwise !== undefined)
        {
            this.anticlockwise = anticlockwise;
        }

        return this.updateData();
    },

    setEndAngle: function (angle, anticlockwise)
    {
        this.endAngle = DegToRad(angle);

        if (anticlockwise !== undefined)
        {
            this.anticlockwise = anticlockwise;
        }

        return this.updateData();
    },

    updateData: function ()
    {
        var step = this.iterations;
        var iteration = step;

        var radius = this.data.radius;
        var startAngle = this.startAngle;
        var endAngle = this.endAngle;
        var anticlockwise = this.anticlockwise;

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
