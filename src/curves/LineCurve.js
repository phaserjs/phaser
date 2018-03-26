/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../utils/Class');
var Curve = require('./Curve');
var FromPoints = require('../geom/rectangle/FromPoints');
var Rectangle = require('../geom/rectangle/Rectangle');
var Vector2 = require('../math/Vector2');

var tmpVec2 = new Vector2();

/**
 * @classdesc
 * [description]
 *
 * @class LineCurve
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector2} p0 - [description]
 * @param {Phaser.Math.Vector2} p1 - [description]
 */
var LineCurve = new Class({

    Extends: Curve,

    initialize:

    //  vec2s or array
    function LineCurve (p0, p1)
    {
        Curve.call(this, 'LineCurve');

        if (Array.isArray(p0))
        {
            p1 = new Vector2(p0[2], p0[3]);
            p0 = new Vector2(p0[0], p0[1]);
        }

        /**
         * [description]
         *
         * @name Phaser.Curves.LineCurve#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p0 = p0;

        /**
         * [description]
         *
         * @property Phaser.Curves.LineCurve#p1
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p1 = p1;
    },

    /**
     * Returns a Rectangle where the position and dimensions match the bounds of this Curve.
     *
     * @method Phaser.Curves.LineCurve#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} [out] - A Rectangle object to store the bounds in. If not given a new Rectangle will be created.
     *
     * @return {Phaser.Geom.Rectangle} A Rectangle object holding the bounds of this curve. If `out` was given it will be this object.
     */
    getBounds: function (out)
    {
        if (out === undefined) { out = new Rectangle(); }

        return FromPoints([ this.p0, this.p1 ], out);
    },

    /**
     * Gets the starting point on the curve.
     *
     * @method Phaser.Curves.LineCurve#getStartPoint
     * @since 3.0.0
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
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getResolution
     * @since 3.0.0
     *
     * @return {integer} [description]
     */
    getResolution: function ()
    {
        return 1;
    },

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.LineCurve#getPoint
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

        if (t === 1)
        {
            return out.copy(this.p1);
        }

        out.copy(this.p1).subtract(this.p0).scale(t).add(this.p0);

        return out;
    },

    // Line curve is linear, so we can overwrite default getPointAt

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getPointAt
     * @since 3.0.0
     *
     * @param {float} u - The position along the curve to return. Where 0 is the start and 1 is the end.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getPointAt: function (u, out)
    {
        return this.getPoint(u, out);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#getTangent
     * @since 3.0.0
     *
     * @return {Phaser.Math.Vector2} [description]
     */
    getTangent: function ()
    {
        var tangent = tmpVec2.copy(this.p1).subtract(this.p0);

        return tangent.normalize();
    },

    //  Override default Curve.draw because this is better than calling getPoints on a line!

    /**
     * Draws this curve on the given Graphics object.
     *
     * The curve is drawn using `Graphics.lineBetween` so will be drawn at whatever the present Graphics line color is.
     * The Graphics object is not cleared before the draw, so the curve will appear on-top of anything else already rendered to it.
     *
     * @method Phaser.Curves.LineCurve#draw
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The Graphics instance onto which this curve will be drawn.
     *
     * @return {Phaser.GameObjects.Graphics} The Graphics object to which the curve was drawn.
     */
    draw: function (graphics)
    {
        graphics.lineBetween(this.p0.x, this.p0.y, this.p1.x, this.p1.y);

        //  So you can chain graphics calls
        return graphics;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.LineCurve#toJSON
     * @since 3.0.0
     *
     * @return {JSONCurve} The JSON object containing this curve data.
     */
    toJSON: function ()
    {
        return {
            type: this.type,
            points: [
                this.p0.x, this.p0.y,
                this.p1.x, this.p1.y
            ]
        };
    }

});

/**
 * [description]
 *
 * @function Phaser.Curves.LineCurve.fromJSON
 * @since 3.0.0
 *
 * @param {JSONCurve} data - The JSON object containing this curve data.
 *
 * @return {Phaser.Curves.LineCurve} [description]
 */
LineCurve.fromJSON = function (data)
{
    var points = data.points;

    var p0 = new Vector2(points[0], points[1]);
    var p1 = new Vector2(points[2], points[3]);

    return new LineCurve(p0, p1);
};

module.exports = LineCurve;
