/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../utils/Class');
var CubicBezier = require('../math/interpolation/CubicBezierInterpolation');
var Curve = require('./Curve');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A higher-order Bézier curve constructed of four points.
 *
 * @class CubicBezier
 * @extends Phaser.Curves.Curve
 * @memberof Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {(Phaser.Math.Vector2|Phaser.Math.Vector2[])} p0 - Start point, or an array of point pairs.
 * @param {Phaser.Math.Vector2} p1 - Control Point 1.
 * @param {Phaser.Math.Vector2} p2 - Control Point 2.
 * @param {Phaser.Math.Vector2} p3 - End Point.
 */
var CubicBezierCurve = new Class({

    Extends: Curve,

    initialize:

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
         * The start point of this curve.
         *
         * @name Phaser.Curves.CubicBezier#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p0 = p0;

        /**
         * The first control point of this curve.
         *
         * @name Phaser.Curves.CubicBezier#p1
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p1 = p1;

        /**
         * The second control point of this curve.
         *
         * @name Phaser.Curves.CubicBezier#p2
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p2 = p2;

        /**
         * The end point of this curve.
         *
         * @name Phaser.Curves.CubicBezier#p3
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p3 = p3;
    },

    /**
     * Gets the starting point on the curve.
     *
     * @method Phaser.Curves.CubicBezier#getStartPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    /**
     * Returns the resolution of this curve.
     *
     * @method Phaser.Curves.CubicBezier#getResolution
     * @since 3.0.0
     *
     * @param {number} divisions - The amount of divisions used by this curve.
     *
     * @return {number} The resolution of the curve.
     */
    getResolution: function (divisions)
    {
        return divisions;
    },

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.CubicBezier#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} t - The position along the curve to return. Where 0 is the start and 1 is the end.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
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
     * Draws this curve to the specified graphics object.
     *
     * @method Phaser.Curves.CubicBezier#draw
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.Graphics} G - [graphics,$return]
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The graphics object this curve should be drawn to.
     * @param {integer} [pointsTotal=32] - The number of intermediary points that make up this curve. A higher number of points will result in a smoother curve.
     *
     * @return {Phaser.GameObjects.Graphics} The graphics object this curve was drawn to. Useful for method chaining.
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
     * Returns a JSON object that describes this curve.
     *
     * @method Phaser.Curves.CubicBezier#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Curves.JSONCurve} The JSON object containing this curve data.
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

/**
 * Generates a curve from a JSON object.
 *
 * @function Phaser.Curves.CubicBezier.fromJSON
 * @since 3.0.0
 *
 * @param {Phaser.Types.Curves.JSONCurve} data - The JSON object containing this curve data.
 *
 * @return {Phaser.Curves.CubicBezier} The curve generated from the JSON object.
 */
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
