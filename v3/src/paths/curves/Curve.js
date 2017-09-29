//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var FromPoints = require('../../geom/rectangle/FromPoints');
var Rectangle = require('../../geom/rectangle/Rectangle');
var Vector2 = require('../../math/Vector2');

//  Local cache vars

var tmpVec2A = new Vector2();
var tmpVec2B = new Vector2();

//  Our Base Curve which all other curves extend

var Curve = new Class({

    initialize:

    function Curve ()
    {
        this.defaultDivisions = 5;

        this.arcLengthDivisions = 100;

        this.cacheArcLengths = [];

        this.needsUpdate = true;

        this.active = true;
    },

    getBounds: function (out)
    {
        if (out === undefined) { out = new Rectangle(); }

        //  The length of the curve in pixels
        //  So we'll have 1 spaced point per 10 pixels

        var spaced = Math.max(1, Math.round(this.getLength() / 10));

        return FromPoints(this.getSpacedPoints(spaced), out);
    },

    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPointAt(0, out);
    },

    getEndPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPointAt(1, out);
    },

    // Get point at relative position in curve according to arc length

    // - u [0 .. 1]

    getPointAt: function (u, out)
    {
        var t = this.getUtoTmapping(u);

        return this.getPoint(t, out);
    },

    // Get sequence of points using getPoint( t )

    getPoints: function (divisions)
    {
        if (divisions === undefined) { divisions = this.defaultDivisions; }

        var points = [];

        for (var d = 0; d <= divisions; d++)
        {
            points.push(this.getPoint(d / divisions));
        }

        return points;
    },

    // Get sequence of points using getPointAt( u )

    getSpacedPoints: function (divisions)
    {
        if (divisions === undefined) { divisions = this.defaultDivisions; }

        var points = [];

        for (var d = 0; d <= divisions; d++)
        {
            var t = this.getUtoTmapping(d / divisions, null, divisions);

            points.push(this.getPoint(t));
        }

        return points;
    },

    // Get total curve arc length

    getLength: function ()
    {
        var lengths = this.getLengths();

        return lengths[lengths.length - 1];
    },

    // Get list of cumulative segment lengths

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
        var last = this.getPoint(0, tmpVec2A);
        var sum = 0;

        cache.push(0);

        for (var p = 1; p <= divisions; p++)
        {
            current = this.getPoint(p / divisions, tmpVec2B);

            sum += current.distance(last);

            cache.push(sum);

            last.copy(current);
        }

        this.cacheArcLengths = cache;

        return cache; // { sums: cache, sum:sum }; Sum is in the last element.
    },

    updateArcLengths: function ()
    {
        this.needsUpdate = true;

        this.getLengths();
    },

    //  Given a distance in pixels, get a t to find p.
    getTFromDistance: function (distance, divisions)
    {
        if (distance <= 0)
        {
            return 0;
        }

        return this.getUtoTmapping(0, distance, divisions);
    },

    // Given u ( 0 .. 1 ), get a t to find p. This gives you points which are equidistant

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

    // Returns a unit vector tangent at t
    // In case any sub curve does not implement its tangent derivation,
    // 2 points a small delta apart will be used to find its gradient
    // which seems to give a reasonable approximation

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

        this.getPoint(t1, tmpVec2A);
        this.getPoint(t2, out);

        return out.sub(tmpVec2A).normalize();
    },

    getTangentAt: function (u, out)
    {
        var t = this.getUtoTmapping(u);

        return this.getTangent(t, out);
    },

    draw: function (graphics, pointsTotal)
    {
        if (pointsTotal === undefined) { pointsTotal = 32; }

        var start = this.getStartPoint();
        var points = this.getPoints(pointsTotal);

        graphics.beginPath();

        graphics.moveTo(start.x, start.y);

        for (var i = 1; i < points.length; i++)
        {
            graphics.lineTo(points[i].x, points[i].y);
        }

        graphics.strokePath();
        graphics.closePath();

        //  So you can chain graphics calls
        return graphics;
    }

});

module.exports = Curve;
