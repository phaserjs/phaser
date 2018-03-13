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
     * @param {[type]} points - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} x - [description]
     * @param {[type]} y - [description]
     *
     * @return {[type]} [description]
     */
    addPoint: function (x, y)
    {
        var vec = new Vector2(x, y);

        this.points.push(vec);

        return vec;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.SplineCurve#getStartPoint
     * @since 3.0.0
     *
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} divisions - [description]
     *
     * @return {[type]} [description]
     */
    getResolution: function (divisions)
    {
        return divisions * this.points.length;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.SplineCurve#getPoint
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
     * @return {object} [description]
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

SplineCurve.fromJSON = function (data)
{
    return new SplineCurve(data.points);
};

module.exports = SplineCurve;
