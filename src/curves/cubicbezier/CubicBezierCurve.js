//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var CubicBezier = require('../../math/interpolation/CubicBezierInterpolation');
var Curve = require('../curve/Curve');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class CubicBezierCurve
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {[type]} p0 - [description]
 * @param {[type]} p1 - [description]
 * @param {[type]} p2 - [description]
 * @param {[type]} p3 - [description]
 */
var CubicBezierCurve = new Class({

    Extends: Curve,

    initialize:

    //  p0 = start point (or an array of point pairs)
    //  p1 = control point 1
    //  p2 = control point 2
    //  p3 = end point
    function CubicBezierCurve (p0, p1, p2, p3)
    {
        Curve.call(this, 'CubicBezierCurve');

        if (Array.isArray(p0))
        {
            p3 = new Vector2(p0[6], p0[7]);
            p2 = new Vector2(p0[4], p0[5]);
            p1 = new Vector2(p0[2], p0[3]);
            p0 = new Vector2(p0[0], p0[1]);
        }

        /**
         * [description]
         *
         * @property {[type]} p0
         * @since 3.0.0
         */
        this.p0 = p0;

        /**
         * [description]
         *
         * @property {[type]} p1
         * @since 3.0.0
         */
        this.p1 = p1;

        /**
         * [description]
         *
         * @property {[type]} p2
         * @since 3.0.0
         */
        this.p2 = p2;

        /**
         * [description]
         *
         * @property {[type]} p3
         * @since 3.0.0
         */
        this.p3 = p3;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.CubicBezierCurve#getStartPoint
     * @since 3.0.0
     *
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.CubicBezierCurve#getResolution
     * @since 3.0.0
     *
     * @param {[type]} divisions - [description]
     *
     * @return {[type]} [description]
     */
    getResolution: function (divisions)
    {
        return divisions;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.CubicBezierCurve#getPoint
     * @since 3.0.0
     *
     * @param {[type]} t - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var p0 = this.p0;
        var p1 = this.p1;
        var p2 = this.p2;
        var p3 = this.p3;

        return out.set(CubicBezier(t, p0.x, p1.x, p2.x, p3.x), CubicBezier(t, p0.y, p1.y, p2.y, p3.y));
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.CubicBezierCurve#draw
     * @since 3.0.0
     *
     * @param {[type]} graphics - [description]
     * @param {[type]} pointsTotal - [description]
     *
     * @return {[type]} [description]
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
     * @method Phaser.Curves.CubicBezierCurve#toJSON
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    toJSON: function ()
    {
        return {
            type: this.type,
            points: [
                this.p0.x, this.p0.y,
                this.p1.x, this.p1.y,
                this.p2.x, this.p2.y,
                this.p3.x, this.p3.y
            ]
        };
    }

});

CubicBezierCurve.fromJSON = function (data)
{
    var points = data.points;

    var p0 = new Vector2(points[0], points[1]);
    var p1 = new Vector2(points[2], points[3]);
    var p2 = new Vector2(points[4], points[5]);
    var p3 = new Vector2(points[6], points[7]);

    return new CubicBezierCurve(p0, p1, p2, p3);
};

module.exports = CubicBezierCurve;
