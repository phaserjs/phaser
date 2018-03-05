/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var Curve = require('./Curve');
var QuadraticBezierInterpolation = require('../math/interpolation/QuadraticBezierInterpolation');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class QuadraticBezier
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.2.0
 *
 * @param {Phaser.Math.Vector2|Phaser.Math.Vector2[]} p0 - Start point, or an array of point pairs.
 * @param {Phaser.Math.Vector2} p1 - Control Point 1.
 * @param {Phaser.Math.Vector2} p2 - Control Point 2.
 */
var QuadraticBezier = new Class({

    Extends: Curve,

    initialize:

    function QuadraticBezier (p0, p1, p2)
    {
        Curve.call(this, 'QuadraticBezier');

        if (Array.isArray(p0))
        {
            p2 = new Vector2(p0[4], p0[5]);
            p1 = new Vector2(p0[2], p0[3]);
            p0 = new Vector2(p0[0], p0[1]);
        }

        /**
         * [description]
         *
         * @name Phaser.Curves.QuadraticBezier#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.2.0
         */
        this.p0 = p0;

        /**
         * [description]
         *
         * @name Phaser.Curves.QuadraticBezier#p1
         * @type {Phaser.Math.Vector2}
         * @since 3.2.0
         */
        this.p1 = p1;

        /**
         * [description]
         *
         * @name Phaser.Curves.QuadraticBezier#p2
         * @type {Phaser.Math.Vector2}
         * @since 3.2.0
         */
        this.p2 = p2;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.QuadraticBezier#getStartPoint
     * @since 3.2.0
     *
     * @param {Phaser.Math.Vector2} out - [description]
     *
     * @return {Phaser.Math.Vector2} [description]
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.QuadraticBezier#getResolution
     * @since 3.2.0
     *
     * @param {number} divisions - [description]
     *
     * @return {number} [description]
     */
    getResolution: function (divisions)
    {
        return divisions;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.QuadraticBezier#getPoint
     * @since 3.2.0
     *
     * @param {number} t - [description]
     * @param {Phaser.Math.Vector2} [out] - [description]
     *
     * @return {Phaser.Math.Vector2} [description]
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var p0 = this.p0;
        var p1 = this.p1;
        var p2 = this.p2;

        return out.set(
            QuadraticBezierInterpolation(t, p0.x, p1.x, p2.x),
            QuadraticBezierInterpolation(t, p0.y, p1.y, p2.y)
        );
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.QuadraticBezier#draw
     * @since 3.2.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - [description]
     * @param {integer} [pointsTotal=32] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} [description]
     */
    draw: function (graphics, pointsTotal)
    {
        if (pointsTotal === undefined) { pointsTotal = 32; }

        var points = this.getPoints(pointsTotal);

        graphics.beginPath();
        graphics.moveTo(this.p0.x, this.p0.y);

        for (var i = 1; i < points.length; i++)
        {
            graphics.lineTo(points[i].x, points[i].y);
        }

        graphics.strokePath();

        //  So you can chain graphics calls
        return graphics;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.QuadraticBezier#toJSON
     * @since 3.2.0
     *
     * @return {object} [description]
     */
    toJSON: function ()
    {
        return {
            type: this.type,
            points: [
                this.p0.x, this.p0.y,
                this.p1.x, this.p1.y,
                this.p2.x, this.p2.y
            ]
        };
    }

});

QuadraticBezier.fromJSON = function (data)
{
    var points = data.points;

    var p0 = new Vector2(points[0], points[1]);
    var p1 = new Vector2(points[2], points[3]);
    var p2 = new Vector2(points[4], points[5]);

    return new QuadraticBezier(p0, p1, p2);
};

module.exports = QuadraticBezier;
