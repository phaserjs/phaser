/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var FromPoints = require('../geom/rectangle/FromPoints');
var Rectangle = require('../geom/rectangle/Rectangle');
var Vector2 = require('../math/Vector2');

/**
 * @classdesc
 * A Base Curve class, which all other curve types extend.
 *
 * Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)
 *
 * @class Curve
 * @memberof Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {string} type - The curve type.
 */
var Curve = new Class({

    initialize:

    function Curve (type)
    {
        /**
         * String based identifier for the type of curve.
         *
         * @name Phaser.Curves.Curve#type
         * @type {string}
         * @since 3.0.0
         */
        this.type = type;

        /**
         * The default number of divisions within the curve.
         *
         * @name Phaser.Curves.Curve#defaultDivisions
         * @type {number}
         * @default 5
         * @since 3.0.0
         */
        this.defaultDivisions = 5;

        /**
         * The quantity of arc length divisions within the curve.
         *
         * @name Phaser.Curves.Curve#arcLengthDivisions
         * @type {number}
         * @default 100
         * @since 3.0.0
         */
        this.arcLengthDivisions = 100;

        /**
         * An array of cached arc length values.
         *
         * @name Phaser.Curves.Curve#cacheArcLengths
         * @type {number[]}
         * @default []
         * @since 3.0.0
         */
        this.cacheArcLengths = [];

        /**
         * Does the data of this curve need updating?
         *
         * @name Phaser.Curves.Curve#needsUpdate
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.needsUpdate = true;

        /**
         * For a curve on a Path, `false` means the Path will ignore this curve.
         *
         * @name Phaser.Curves.Curve#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * A temporary calculation Vector.
         *
         * @name Phaser.Curves.Curve#_tmpVec2A
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tmpVec2A = new Vector2();

        /**
         * A temporary calculation Vector.
         *
         * @name Phaser.Curves.Curve#_tmpVec2B
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tmpVec2B = new Vector2();
    },

    /**
     * Draws this curve on the given Graphics object.
     *
     * The curve is drawn using `Graphics.strokePoints` so will be drawn at whatever the present Graphics stroke color is.
     * The Graphics object is not cleared before the draw, so the curve will appear on-top of anything else already rendered to it.
     *
     * @method Phaser.Curves.Curve#draw
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.Graphics} G - [graphics,$return]
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The Graphics instance onto which this curve will be drawn.
     * @param {number} [pointsTotal=32] - The resolution of the curve. The higher the value the smoother it will render, at the cost of rendering performance.
     *
     * @return {Phaser.GameObjects.Graphics} The Graphics object to which the curve was drawn.
     */
    draw: function (graphics, pointsTotal)
    {
        if (pointsTotal === undefined) { pointsTotal = 32; }

        //  So you can chain graphics calls
        return graphics.strokePoints(this.getPoints(pointsTotal));
    },

    /**
     * Returns a Rectangle where the position and dimensions match the bounds of this Curve.
     *
     * You can control the accuracy of the bounds. The value given is used to work out how many points
     * to plot across the curve. Higher values are more accurate at the cost of calculation speed.
     *
     * @method Phaser.Curves.Curve#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} [out] - The Rectangle to store the bounds in. If falsey a new object will be created.
     * @param {number} [accuracy=16] - The accuracy of the bounds calculations.
     *
     * @return {Phaser.Geom.Rectangle} A Rectangle object holding the bounds of this curve. If `out` was given it will be this object.
     */
    getBounds: function (out, accuracy)
    {
        if (!out) { out = new Rectangle(); }
        if (accuracy === undefined) { accuracy = 16; }

        var len = this.getLength();

        if (accuracy > len)
        {
            accuracy = len / 2;
        }

        //  The length of the curve in pixels
        //  So we'll have 1 spaced point per 'accuracy' pixels

        var spaced = Math.max(1, Math.round(len / accuracy));

        return FromPoints(this.getSpacedPoints(spaced), out);
    },

    /**
     * Returns an array of points, spaced out X distance pixels apart.
     * The smaller the distance, the larger the array will be.
     *
     * @method Phaser.Curves.Curve#getDistancePoints
     * @since 3.0.0
     *
     * @param {number} distance - The distance, in pixels, between each point along the curve.
     *
     * @return {Phaser.Geom.Point[]} An Array of Point objects.
     */
    getDistancePoints: function (distance)
    {
        var len = this.getLength();

        var spaced = Math.max(1, len / distance);

        return this.getSpacedPoints(spaced);
    },

    /**
     * Get a point at the end of the curve.
     *
     * @method Phaser.Curves.Curve#getEndPoint
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} [out] - Optional Vector object to store the result in.
     *
     * @return {Phaser.Math.Vector2} Vector2 containing the coordinates of the curves end point.
     */
    getEndPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPointAt(1, out);
    },

    /**
     * Get total curve arc length
     *
     * @method Phaser.Curves.Curve#getLength
     * @since 3.0.0
     *
     * @return {number} The total length of the curve.
     */
    getLength: function ()
    {
        var lengths = this.getLengths();

        return lengths[lengths.length - 1];
    },


    /**
     * Get a list of cumulative segment lengths.
     *
     * These lengths are
     *
     * - [0] 0
     * - [1] The first segment
     * - [2] The first and second segment
     * - ...
     * - [divisions] All segments
     *
     * @method Phaser.Curves.Curve#getLengths
     * @since 3.0.0
     *
     * @param {number} [divisions] - The number of divisions or segments.
     *
     * @return {number[]} An array of cumulative lengths.
     */
    getLengths: function (divisions)
    {
        if (divisions === undefined) { divisions = this.arcLengthDivisions; }

        if ((this.cacheArcLengths.length === divisions + 1) && !this.needsUpdate)
        {
            return this.cacheArcLengths;
        }

        this.needsUpdate = false;

        var cache = [];
        var current;
        var last = this.getPoint(0, this._tmpVec2A);
        var sum = 0;

        cache.push(0);

        for (var p = 1; p <= divisions; p++)
        {
            current = this.getPoint(p / divisions, this._tmpVec2B);

            sum += current.distance(last);

            cache.push(sum);

            last.copy(current);
        }

        this.cacheArcLengths = cache;

        return cache; // { sums: cache, sum:sum }; Sum is in the last element.
    },

    // Get point at relative position in curve according to arc length

    // - u [0 .. 1]

    /**
     * Get a point at a relative position on the curve, by arc length.
     *
     * @method Phaser.Curves.Curve#getPointAt
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} u - The relative position, [0..1].
     * @param {Phaser.Math.Vector2} [out] - A point to store the result in.
     *
     * @return {Phaser.Math.Vector2} The point.
     */
    getPointAt: function (u, out)
    {
        var t = this.getUtoTmapping(u);

        return this.getPoint(t, out);
    },

    // Get sequence of points using getPoint( t )

    /**
     * Get a sequence of evenly spaced points from the curve.
     *
     * You can pass `divisions`, `stepRate`, or neither.
     *
     * The number of divisions will be
     *
     * 1. `divisions`, if `divisions` > 0; or
     * 2. `this.getLength / stepRate`, if `stepRate` > 0; or
     * 3. `this.defaultDivisions`
     *
     * `1 + divisions` points will be returned.
     *
     * @method Phaser.Curves.Curve#getPoints
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2[]} O - [out,$return]
     *
     * @param {number} [divisions] - The number of divisions to make.
     * @param {number} [stepRate] - The curve distance between points, implying `divisions`.
     * @param {(array|Phaser.Math.Vector2[])} [out] - An optional array to store the points in.
     *
     * @return {(array|Phaser.Math.Vector2[])} An array of Points from the curve.
     */
    getPoints: function (divisions, stepRate, out)
    {
        if (out === undefined) { out = []; }

        //  If divisions is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
        if (!divisions)
        {
            if (!stepRate)
            {
                divisions = this.defaultDivisions;
            }
            else
            {
                divisions = this.getLength() / stepRate;
            }
        }

        for (var d = 0; d <= divisions; d++)
        {
            out.push(this.getPoint(d / divisions));
        }

        return out;
    },

    /**
     * Get a random point from the curve.
     *
     * @method Phaser.Curves.Curve#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - A point object to store the result in.
     *
     * @return {Phaser.Math.Vector2} The point.
     */
    getRandomPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPoint(Math.random(), out);
    },

    // Get sequence of points using getPointAt( u )

    /**
     * Get a sequence of equally spaced points (by arc distance) from the curve.
     *
     * `1 + divisions` points will be returned.
     *
     * @method Phaser.Curves.Curve#getSpacedPoints
     * @since 3.0.0
     *
     * @param {number} [divisions=this.defaultDivisions] - The number of divisions to make.
     * @param {number} [stepRate] - Step between points. Used to calculate the number of points to return when divisions is falsy. Ignored if divisions is positive.
     * @param {(array|Phaser.Math.Vector2[])} [out] - An optional array to store the points in.
     *
     * @return {Phaser.Math.Vector2[]} An array of points.
     */
    getSpacedPoints: function (divisions, stepRate, out)
    {
        if (out === undefined) { out = []; }

        //  If divisions is a falsey value (false, null, 0, undefined, etc) then we calculate it based on the stepRate instead.
        if (!divisions)
        {
            if (!stepRate)
            {
                divisions = this.defaultDivisions;
            }
            else
            {
                divisions = this.getLength() / stepRate;
            }
        }

        for (var d = 0; d <= divisions; d++)
        {
            var t = this.getUtoTmapping(d / divisions, null, divisions);

            out.push(this.getPoint(t));
        }

        return out;
    },

    /**
     * Get a point at the start of the curve.
     *
     * @method Phaser.Curves.Curve#getStartPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - A point to store the result in.
     *
     * @return {Phaser.Math.Vector2} The point.
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPointAt(0, out);
    },

    /**
     * Get a unit vector tangent at a relative position on the curve.
     * In case any sub curve does not implement its tangent derivation,
     * 2 points a small delta apart will be used to find its gradient
     * which seems to give a reasonable approximation
     *
     * @method Phaser.Curves.Curve#getTangent
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} t - The relative position on the curve, [0..1].
     * @param {Phaser.Math.Vector2} [out] - A vector to store the result in.
     *
     * @return {Phaser.Math.Vector2} Vector approximating the tangent line at the point t (delta +/- 0.0001)
     */
    getTangent: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var delta = 0.0001;
        var t1 = t - delta;
        var t2 = t + delta;

        // Capping in case of danger

        if (t1 < 0)
        {
            t1 = 0;
        }

        if (t2 > 1)
        {
            t2 = 1;
        }

        this.getPoint(t1, this._tmpVec2A);
        this.getPoint(t2, out);

        return out.subtract(this._tmpVec2A).normalize();
    },

    /**
     * Get a unit vector tangent at a relative position on the curve, by arc length.
     *
     * @method Phaser.Curves.Curve#getTangentAt
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} u - The relative position on the curve, [0..1].
     * @param {Phaser.Math.Vector2} [out] - A vector to store the result in.
     *
     * @return {Phaser.Math.Vector2} The tangent vector.
     */
    getTangentAt: function (u, out)
    {
        var t = this.getUtoTmapping(u);

        return this.getTangent(t, out);
    },

    /**
     * Given a distance in pixels, get a t to find p.
     *
     * @method Phaser.Curves.Curve#getTFromDistance
     * @since 3.0.0
     *
     * @param {number} distance - The distance, in pixels.
     * @param {number} [divisions] - Optional amount of divisions.
     *
     * @return {number} The distance.
     */
    getTFromDistance: function (distance, divisions)
    {
        if (distance <= 0)
        {
            return 0;
        }

        return this.getUtoTmapping(0, distance, divisions);
    },

    /**
     * Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant.
     *
     * @method Phaser.Curves.Curve#getUtoTmapping
     * @since 3.0.0
     *
     * @param {number} u - A float between 0 and 1.
     * @param {number} distance - The distance, in pixels.
     * @param {number} [divisions] - Optional amount of divisions.
     *
     * @return {number} The equidistant value.
     */
    getUtoTmapping: function (u, distance, divisions)
    {
        var arcLengths = this.getLengths(divisions);

        var i = 0;
        var il = arcLengths.length;

        var targetArcLength; // The targeted u distance value to get

        if (distance)
        {
            //  Cannot overshoot the curve
            targetArcLength = Math.min(distance, arcLengths[il - 1]);
        }
        else
        {
            targetArcLength = u * arcLengths[il - 1];
        }

        // binary search for the index with largest value smaller than target u distance

        var low = 0;
        var high = il - 1;
        var comparison;

        while (low <= high)
        {
            i = Math.floor(low + (high - low) / 2); // less likely to overflow, though probably not issue here, JS doesn't really have integers, all numbers are floats

            comparison = arcLengths[i] - targetArcLength;

            if (comparison < 0)
            {
                low = i + 1;
            }
            else if (comparison > 0)
            {
                high = i - 1;
            }
            else
            {
                high = i;
                break;
            }
        }

        i = high;

        if (arcLengths[i] === targetArcLength)
        {
            return i / (il - 1);
        }

        // we could get finer grain at lengths, or use simple interpolation between two points

        var lengthBefore = arcLengths[i];
        var lengthAfter = arcLengths[i + 1];

        var segmentLength = lengthAfter - lengthBefore;

        // determine where we are between the 'before' and 'after' points

        var segmentFraction = (targetArcLength - lengthBefore) / segmentLength;

        // add that fractional amount to t

        return (i + segmentFraction) / (il - 1);
    },

    /**
     * Calculate and cache the arc lengths.
     *
     * @method Phaser.Curves.Curve#updateArcLengths
     * @since 3.0.0
     *
     * @see Phaser.Curves.Curve#getLengths()
     */
    updateArcLengths: function ()
    {
        this.needsUpdate = true;

        this.getLengths();
    }

});

module.exports = Curve;
