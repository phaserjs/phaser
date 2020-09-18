/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var Curve = require('./Curve');
var QuadraticBezierInterpolation = require('../math/interpolation/QuadraticBezierInterpolation');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A quadratic Bézier curve constructed from two control points.
 *
 * @class QuadraticBezier
 * @extends Phaser.Curves.Curve
 * @memberof Phaser.Curves
 * @constructor
 * @since 3.2.0
 *
 * @param {(Phaser.Math.Vector2|number[])} p0 - Start point, or an array of point pairs.
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
         * The start point.
         *
         * @name Phaser.Curves.QuadraticBezier#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.2.0
         */
        this.p0 = p0;

        /**
         * The first control point.
         *
         * @name Phaser.Curves.QuadraticBezier#p1
         * @type {Phaser.Math.Vector2}
         * @since 3.2.0
         */
        this.p1 = p1;

        /**
         * The second control point.
         *
         * @name Phaser.Curves.QuadraticBezier#p2
         * @type {Phaser.Math.Vector2}
         * @since 3.2.0
         */
        this.p2 = p2;
    },

    /**
     * Gets the starting point on the curve.
     *
     * @method Phaser.Curves.QuadraticBezier#getStartPoint
     * @since 3.2.0
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
     * Get the resolution of the curve.
     *
     * @method Phaser.Curves.QuadraticBezier#getResolution
     * @since 3.2.0
     *
     * @param {number} divisions - Optional divisions value.
     *
     * @return {number} The curve resolution.
     */
    getResolution: function (divisions)
    {
        return divisions;
    },

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.QuadraticBezier#getPoint
     * @since 3.2.0
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

        return out.set(
            QuadraticBezierInterpolation(t, p0.x, p1.x, p2.x),
            QuadraticBezierInterpolation(t, p0.y, p1.y, p2.y)
        );
    },

    /**
     * Draws this curve on the given Graphics object.
     *
     * The curve is drawn using `Graphics.strokePoints` so will be drawn at whatever the present Graphics stroke color is.
     * The Graphics object is not cleared before the draw, so the curve will appear on-top of anything else already rendered to it.
     *
     * @method Phaser.Curves.QuadraticBezier#draw
     * @since 3.2.0
     *
     * @generic {Phaser.GameObjects.Graphics} G - [graphics,$return]
     *
     * @param {Phaser.GameObjects.Graphics} graphics - `Graphics` object to draw onto.
     * @param {integer} [pointsTotal=32] - Number of points to be used for drawing the curve. Higher numbers result in smoother curve but require more processing.
     *
     * @return {Phaser.GameObjects.Graphics} `Graphics` object that was drawn to.
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
     * Converts the curve into a JSON compatible object.
     *
     * @method Phaser.Curves.QuadraticBezier#toJSON
     * @since 3.2.0
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
                this.p2.x, this.p2.y
            ]
        };
    }

});

/**
 * Creates a curve from a JSON object, e. g. created by `toJSON`.
 *
 * @function Phaser.Curves.QuadraticBezier.fromJSON
 * @since 3.2.0
 *
 * @param {Phaser.Types.Curves.JSONCurve} data - The JSON object containing this curve data.
 *
 * @return {Phaser.Curves.QuadraticBezier} The created curve instance.
 */
QuadraticBezier.fromJSON = function (data)
{
    var points = data.points;

    var p0 = new Vector2(points[0], points[1]);
    var p1 = new Vector2(points[2], points[3]);
    var p2 = new Vector2(points[4], points[5]);

    return new QuadraticBezier(p0, p1, p2);
};

module.exports = QuadraticBezier;
