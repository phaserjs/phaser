/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var CatmullRom = require('../math/CatmullRom');
var Class = require('../utils/Class');
var Curve = require('./Curve');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class SplineCurve
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2[]} [points] - [description]
 */
var SplineCurve = new Class({

    Extends: Curve,

    initialize:

    function SplineCurve (points)
    {
        if (points === undefined) { points = []; }

        Curve.call(this, 'SplineCurve');

        /**
         * [description]
         *
         * @name Phaser.Curves.SplineCurve#points
         * @type {Phaser.Math.Vector2[]}
         * @default []
         * @since 3.0.0
         */
        this.points = [];

        this.addPoints(points);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.SplineCurve#addPoints
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2[]} points - [description]
     *
     * @return {Phaser.Curves.SplineCurve} This curve object.
     */
    addPoints: function (points)
    {
        for (var i = 0; i < points.length; i++)
        {
            var p = new Vector2();

            if (typeof points[i] === 'number')
            {
                p.x = points[i];
                p.y = points[i + 1];
                i++;
            }
            else if (Array.isArray(points[i]))
            {
                //  An array of arrays?
                p.x = points[i][0];
                p.y = points[i][1];
            }
            else
            {
                p.x = points[i].x;
                p.y = points[i].y;
            }

            this.points.push(p);
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.SplineCurve#addPoint
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Math.Vector2} [description]
     */
    addPoint: function (x, y)
    {
        var vec = new Vector2(x, y);

        this.points.push(vec);

        return vec;
    },

    /**
     * Gets the starting point on the curve.
     *
     * @method Phaser.Curves.SplineCurve#getStartPoint
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.points[0]);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.SplineCurve#getResolution
     * @since 3.0.0
     *
     * @param {number} divisions - [description]
     *
     * @return {number} [description]
     */
    getResolution: function (divisions)
    {
        return divisions * this.points.length;
    },

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.SplineCurve#getPoint
     * @since 3.0.0
     *
     * @param {float} t - The position along the curve to return. Where 0 is the start and 1 is the end.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var points = this.points;

        var point = (points.length - 1) * t;

        var intPoint = Math.floor(point);

        var weight = point - intPoint;

        var p0 = points[(intPoint === 0) ? intPoint : intPoint - 1];
        var p1 = points[intPoint];
        var p2 = points[(intPoint > points.length - 2) ? points.length - 1 : intPoint + 1];
        var p3 = points[(intPoint > points.length - 3) ? points.length - 1 : intPoint + 2];

        return out.set(CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), CatmullRom(weight, p0.y, p1.y, p2.y, p3.y));
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.SplineCurve#toJSON
     * @since 3.0.0
     *
     * @return {JSONCurve} The JSON object containing this curve data.
     */
    toJSON: function ()
    {
        var points = [];

        for (var i = 0; i < this.points.length; i++)
        {
            points.push(this.points[i].x);
            points.push(this.points[i].y);
        }

        return {
            type: this.type,
            points: points
        };
    }

});

/**
 * [description]
 *
 * @function Phaser.Curves.SplineCurve.fromJSON
 * @since 3.0.0
 *
 * @param {JSONCurve} data - The JSON object containing this curve data.
 *
 * @return {Phaser.Curves.SplineCurve} [description]
 */
SplineCurve.fromJSON = function (data)
{
    return new SplineCurve(data.points);
};

module.exports = SplineCurve;
