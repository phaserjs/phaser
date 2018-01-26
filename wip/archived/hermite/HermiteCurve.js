//  Created for Phaser 3
//  Curve class based work done in three.js by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../../utils/Class');
var Curve = require('../Curve');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.Hermite

/**
* A data representation of a Hermite Curve (see http://en.wikipedia.org/wiki/Cubic_Hermite_spline)
* 
* A Hermite curve has a start and end point and tangent vectors for both of them.
* The curve will always pass through the two control points and the shape of it is controlled
* by the length and direction of the tangent vectors.  At the control points the curve will
* be facing exactly in the vector direction.
* 
* As these curves change speed (speed = distance between points separated by an equal change in
* 't' value - see Hermite.getPoint) this class attempts to reduce the variation by pre-calculating
* the `accuracy` number of points on the curve. The straight-line distances to these points are stored
* in the private 'points' array, and this information is used by Hermite.findT() to convert a pixel
* distance along the curve into a 'time' value.
* 
* Higher `accuracy` values will result in more even movement, but require more memory for the points
* list. 5 works, but 10 seems to be an ideal value for the length of curves found in most games on
* a desktop screen. If you use very long curves (more than 400 pixels) you may need to increase
* this value further.
*
* @param {number} p1x - The x coordinate of the start of the curve.
* @param {number} p1y - The y coordinate of the start of the curve.
* @param {number} p2x - The x coordinate of the end of the curve.
* @param {number} p2y - The y coordinate of the end of the curve.
* @param {number} v1x - The x component of the tangent vector for the start of the curve.
* @param {number} v1y - The y component of the tangent vector for the start of the curve.
* @param {number} v2x - The x component of the tangent vector for the end of the curve.
* @param {number} v2y - The y component of the tangent vector for the end of the curve.
* @param {number} [accuracy=10] The amount of points to pre-calculate on the curve.
*/
var HermiteCurve = new Class({

    Extends: Curve,

    initialize:

    //  p0 = start point
    //  p1 = end point
    //  v0 = start tangent point
    //  v1 = end tangent point
    function HermiteCurve (p0, p1, v0, v1)
    {
        Curve.call(this);

        if (Array.isArray(p0))
        {
            v1 = new Vector2(p0[6], p0[7]);
            v0 = new Vector2(p0[4], p0[5]);
            p1 = new Vector2(p0[2], p0[3]);
            p0 = new Vector2(p0[0], p0[1]);
        }

        this.p0 = p0;
        this.p1 = p1;
        this.v0 = v0;
        this.v1 = v1;
    },

    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    getResolution: function (divisions)
    {
        return divisions;
    },

    /**
    * Performs the curve calculations.
    *
    * This is called automatically if you change any of the curves public properties, such as `Hermite.p1x` or `Hermite.v2y`.
    *
    * If you adjust any of the internal private values, then call this to update the points.
    *
    * @method Phaser.Hermite#recalculate
    * @return {Phaser.Hermite} This object.
    */
    recalculate: function ()
    {
        this._ax = (2 * this._p1x - 2 * this._p2x + this._v1x + this._v2x);
        this._ay = (2 * this._p1y - 2 * this._p2y + this._v1y + this._v2y);
        this._bx = (-3 * this._p1x + 3 * this._p2x - 2 * this._v1x - this._v2x);
        this._by = (-3 * this._p1y + 3 * this._p2y - 2 * this._v1y - this._v2y);

        this.length = this.calculateEvenPoints();

        return this;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var t2 = t * t;
        var t3 = t * t2;

        var ax = (2 * this.p0.x - 2 * this.p1.x + this.v0.x + this.v1.x);
        var ay = (2 * this.p0.y - 2 * this.p1.y + this.v0.y + this.v1.y);
        var bx = (-3 * this.p0.x + 3 * this.p1.x - 2 * this.v0.x - this.v1.x);
        var by = (-3 * this.p0.y + 3 * this.p1.y - 2 * this.v0.y - this.v1.y);

        out.x = t3 * ax + t2 * bx + t * this.v0.x + this.p0.x;
        out.y = t3 * ay + t2 * by + t * this.v0.y + this.p0.y;

        return out;
    },

    // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant

    getUtoTmapping: function (u, distance, divisions)
    {
        //  Find the _points which bracket the distance value
        var ti = Math.floor(distance / this.length * divisions);

        while (ti > 0 && this._points[ti] > distance)
        {
            ti--;
        }

        while (ti < divisions && this._points[ti] < distance)
        {
            ti++;
        }

        //  Linear interpolation to get a more accurate fix
        var dt = this._points[ti] - this._points[ti - 1];
        var d = distance - this._points[ti - 1];

        return ((ti - 1) / divisions) + d / (dt * divisions);
    },



});

module.exports = HermiteCurve;
