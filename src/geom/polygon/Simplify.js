/**
 * @author       Richard Davey <rich@phaser.io>
 * @author       Vladimir Agafonkin
 * @see          Based on Simplify.js mourner.github.io/simplify-js
 */

/**
 * Copyright (c) 2017, Vladimir Agafonkin
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
 * TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/**
 * @ignore
 */
function getSqDist (p1, p2)
{
    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

/**
 * Square distance from a point to a segment
 *
 * @ignore
 */
function getSqSegDist (p, p1, p2)
{
    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0)
    {
        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1)
        {
            x = p2.x;
            y = p2.y;
        }
        else if (t > 0)
        {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}

/**
 * Basic distance-based simplification
 *
 * @ignore
 */
function simplifyRadialDist (points, sqTolerance)
{
    var prevPoint = points[0],
        newPoints = [ prevPoint ],
        point;

    for (var i = 1, len = points.length; i < len; i++)
    {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance)
        {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point)
    {
        newPoints.push(point);
    }

    return newPoints;
}

/**
 * @ignore
 */
function simplifyDPStep (points, first, last, sqTolerance, simplified)
{
    var maxSqDist = sqTolerance,
        index;

    for (var i = first + 1; i < last; i++)
    {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist)
        {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance)
    {
        if (index - first > 1)
        {
            simplifyDPStep(points, first, index, sqTolerance, simplified);
        }

        simplified.push(points[index]);

        if (last - index > 1)
        {
            simplifyDPStep(points, index, last, sqTolerance, simplified);
        }
    }
}

/**
 * Simplification using Ramer-Douglas-Peucker algorithm
 *
 * @ignore
 */
function simplifyDouglasPeucker (points, sqTolerance)
{
    var last = points.length - 1;

    var simplified = [ points[0] ];

    simplifyDPStep(points, 0, last, sqTolerance, simplified);

    simplified.push(points[last]);

    return simplified;
}

/**
 * Takes a Polygon object and simplifies the points by running them through a combination of
 * Douglas-Peucker and Radial Distance algorithms. Simplification dramatically reduces the number of
 * points in a polygon while retaining its shape, giving a huge performance boost when processing
 * it and also reducing visual noise.
 *
 * @function Phaser.Geom.Polygon.Simplify
 * @since 3.50.0
 *
 * @generic {Phaser.Geom.Polygon} O - [polygon,$return]
 *
 * @param {Phaser.Geom.Polygon} polygon - The polygon to be simplified. The polygon will be modified in-place and returned.
 * @param {number} [tolerance=1] - Affects the amount of simplification (in the same metric as the point coordinates).
 * @param {boolean} [highestQuality=false] - Excludes distance-based preprocessing step which leads to highest quality simplification but runs ~10-20 times slower.
 *
 * @return {Phaser.Geom.Polygon} The input polygon.
 */
var Simplify = function (polygon, tolerance, highestQuality)
{
    if (tolerance === undefined) { tolerance = 1; }
    if (highestQuality === undefined) { highestQuality = false; }

    var points = polygon.points;

    if (points.length > 2)
    {
        var sqTolerance = tolerance * tolerance;

        if (!highestQuality)
        {
            points = simplifyRadialDist(points, sqTolerance);
        }

        polygon.setTo(simplifyDouglasPeucker(points, sqTolerance));
    }

    return polygon;
};

module.exports = Simplify;
