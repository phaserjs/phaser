/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var CubicBezierCurve = require('../CubicBezierCurve');
var EllipseCurve = require('../EllipseCurve');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var LineCurve = require('../LineCurve');
var MovePathTo = require('./MoveTo');
var QuadraticBezierCurve = require('../QuadraticBezierCurve');
var Rectangle = require('../../geom/rectangle/Rectangle');
var SplineCurve = require('../SplineCurve');
var Vector2 = require('../../math/Vector2');
var MATH_CONST = require('../../math/const');

/**
 * @classdesc
 * A Path combines multiple Curves into one continuous compound curve.
 * It does not matter how many Curves are in the Path or what type they are.
 *
 * A Curve in a Path does not have to start where the previous Curve ends - that is to say, a Path does not
 * have to be an uninterrupted curve. Only the order of the Curves influences the actual points on the Path.
 *
 * @class Path
 * @memberof Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - The X coordinate of the Path's starting point or a {@link Phaser.Types.Curves.JSONPath}.
 * @param {number} [y=0] - The Y coordinate of the Path's starting point.
 */
var Path = new Class({

    initialize:

    function Path (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        /**
         * The name of this Path.
         * Empty by default and never populated by Phaser, this is left for developers to use.
         *
         * @name Phaser.Curves.Path#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * The list of Curves which make up this Path.
         *
         * @name Phaser.Curves.Path#curves
         * @type {Phaser.Curves.Curve[]}
         * @default []
         * @since 3.0.0
         */
        this.curves = [];

        /**
         * The cached length of each Curve in the Path.
         *
         * Used internally by {@link #getCurveLengths}.
         *
         * @name Phaser.Curves.Path#cacheLengths
         * @type {number[]}
         * @default []
         * @since 3.0.0
         */
        this.cacheLengths = [];

        /**
         * Automatically closes the path.
         *
         * @name Phaser.Curves.Path#autoClose
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.autoClose = false;

        /**
         * The starting point of the Path.
         *
         * This is not necessarily equivalent to the starting point of the first Curve in the Path. In an empty Path, it's also treated as the ending point.
         *
         * @name Phaser.Curves.Path#startPoint
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.startPoint = new Vector2();

        /**
         * A temporary vector used to avoid object creation when adding a Curve to the Path.
         *
         * @name Phaser.Curves.Path#_tmpVec2A
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tmpVec2A = new Vector2();

        /**
         * A temporary vector used to avoid object creation when adding a Curve to the Path.
         *
         * @name Phaser.Curves.Path#_tmpVec2B
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tmpVec2B = new Vector2();

        if (typeof x === 'object')
        {
            this.fromJSON(x);
        }
        else
        {
            this.startPoint.set(x, y);
        }
    },

    /**
     * Appends a Curve to the end of the Path.
     *
     * The Curve does not have to start where the Path ends or, for an empty Path, at its defined starting point.
     *
     * @method Phaser.Curves.Path#add
     * @since 3.0.0
     *
     * @param {Phaser.Curves.Curve} curve - The Curve to append.
     *
     * @return {this} This Path object.
     */
    add: function (curve)
    {
        this.curves.push(curve);

        return this;
    },

    /**
     * Creates a circular Ellipse Curve positioned at the end of the Path.
     *
     * @method Phaser.Curves.Path#circleTo
     * @since 3.0.0
     *
     * @param {number} radius - The radius of the circle.
     * @param {boolean} [clockwise=false] - `true` to create a clockwise circle as opposed to a counter-clockwise circle.
     * @param {number} [rotation=0] - The rotation of the circle in degrees.
     *
     * @return {this} This Path object.
     */
    circleTo: function (radius, clockwise, rotation)
    {
        if (clockwise === undefined) { clockwise = false; }

        return this.ellipseTo(radius, radius, 0, 360, clockwise, rotation);
    },

    /**
     * Ensures that the Path is closed.
     *
     * A closed Path starts and ends at the same point. If the Path is not closed, a straight Line Curve will be created from the ending point directly to the starting point. During the check, the actual starting point of the Path, i.e. the starting point of the first Curve, will be used as opposed to the Path's defined {@link startPoint}, which could differ.
     *
     * Calling this method on an empty Path will result in an error.
     *
     * @method Phaser.Curves.Path#closePath
     * @since 3.0.0
     *
     * @return {this} This Path object.
     */
    closePath: function ()
    {
        // Add a line curve if start and end of lines are not connected
        var startPoint = this.curves[0].getPoint(0);
        var endPoint = this.curves[this.curves.length - 1].getPoint(1);

        if (!startPoint.equals(endPoint))
        {
            //  This will copy a reference to the vectors, which probably isn't sensible
            this.curves.push(new LineCurve(endPoint, startPoint));
        }

        return this;
    },

    /**
     * Creates a cubic bezier curve starting at the previous end point and ending at p3, using p1 and p2 as control points.
     *
     * @method Phaser.Curves.Path#cubicBezierTo
     * @since 3.0.0
     *
     * @param {(number|Phaser.Math.Vector2)} x - The x coordinate of the end point. Or, if a Vector2, the p1 value.
     * @param {(number|Phaser.Math.Vector2)} y - The y coordinate of the end point. Or, if a Vector2, the p2 value.
     * @param {(number|Phaser.Math.Vector2)} control1X - The x coordinate of the first control point. Or, if a Vector2, the p3 value.
     * @param {number} [control1Y] - The y coordinate of the first control point. Not used if Vector2s are provided as the first 3 arguments.
     * @param {number} [control2X] - The x coordinate of the second control point. Not used if Vector2s are provided as the first 3 arguments.
     * @param {number} [control2Y] - The y coordinate of the second control point. Not used if Vector2s are provided as the first 3 arguments.
     *
     * @return {this} This Path object.
     */
    cubicBezierTo: function (x, y, control1X, control1Y, control2X, control2Y)
    {
        var p0 = this.getEndPoint();
        var p1;
        var p2;
        var p3;

        //  Assume they're all Vector2s
        if (x instanceof Vector2)
        {
            p1 = x;
            p2 = y;
            p3 = control1X;
        }
        else
        {
            p1 = new Vector2(control1X, control1Y);
            p2 = new Vector2(control2X, control2Y);
            p3 = new Vector2(x, y);
        }

        return this.add(new CubicBezierCurve(p0, p1, p2, p3));
    },

    //  Creates a quadratic bezier curve starting at the previous end point and ending at p2, using p1 as a control point

    /**
     * Creates a Quadratic Bezier Curve starting at the ending point of the Path.
     *
     * @method Phaser.Curves.Path#quadraticBezierTo
     * @since 3.2.0
     *
     * @param {(number|Phaser.Math.Vector2[])} x - The X coordinate of the second control point or, if it's a `Vector2`, the first control point.
     * @param {number} [y] - The Y coordinate of the second control point or, if `x` is a `Vector2`, the second control point.
     * @param {number} [controlX] - If `x` is not a `Vector2`, the X coordinate of the first control point.
     * @param {number} [controlY] - If `x` is not a `Vector2`, the Y coordinate of the first control point.
     *
     * @return {this} This Path object.
     */
    quadraticBezierTo: function (x, y, controlX, controlY)
    {
        var p0 = this.getEndPoint();
        var p1;
        var p2;

        //  Assume they're all Vector2s
        if (x instanceof Vector2)
        {
            p1 = x;
            p2 = y;
        }
        else
        {
            p1 = new Vector2(controlX, controlY);
            p2 = new Vector2(x, y);
        }

        return this.add(new QuadraticBezierCurve(p0, p1, p2));
    },

    /**
     * Draws all Curves in the Path to a Graphics Game Object.
     *
     * @method Phaser.Curves.Path#draw
     * @since 3.0.0
     *
     * @generic {Phaser.GameObjects.Graphics} G - [out,$return]
     *
     * @param {Phaser.GameObjects.Graphics} graphics - The Graphics Game Object to draw to.
     * @param {number} [pointsTotal=32] - The number of points to draw for each Curve. Higher numbers result in a smoother curve but require more processing.
     *
     * @return {Phaser.GameObjects.Graphics} The Graphics object which was drawn to.
     */
    draw: function (graphics, pointsTotal)
    {
        for (var i = 0; i < this.curves.length; i++)
        {
            var curve = this.curves[i];

            if (!curve.active)
            {
                continue;
            }

            curve.draw(graphics, pointsTotal);
        }

        return graphics;
    },

    /**
     * Creates an ellipse curve positioned at the previous end point, using the given parameters.
     *
     * @method Phaser.Curves.Path#ellipseTo
     * @since 3.0.0
     *
     * @param {number} [xRadius=0] - The horizontal radius of ellipse.
     * @param {number} [yRadius=0] - The vertical radius of ellipse.
     * @param {number} [startAngle=0] - The start angle of the ellipse, in degrees.
     * @param {number} [endAngle=360] - The end angle of the ellipse, in degrees.
     * @param {boolean} [clockwise=false] - Whether the ellipse angles are given as clockwise (`true`) or counter-clockwise (`false`).
     * @param {number} [rotation=0] - The rotation of the ellipse, in degrees.
     *
     * @return {this} This Path object.
     */
    ellipseTo: function (xRadius, yRadius, startAngle, endAngle, clockwise, rotation)
    {
        var ellipse = new EllipseCurve(0, 0, xRadius, yRadius, startAngle, endAngle, clockwise, rotation);

        var end = this.getEndPoint(this._tmpVec2A);

        //  Calculate where to center the ellipse
        var start = ellipse.getStartPoint(this._tmpVec2B);

        end.subtract(start);

        ellipse.x = end.x;
        ellipse.y = end.y;

        return this.add(ellipse);
    },

    /**
     * Creates a Path from a Path Configuration object.
     *
     * The provided object should be a {@link Phaser.Types.Curves.JSONPath}, as returned by {@link #toJSON}. Providing a malformed object may cause errors.
     *
     * @method Phaser.Curves.Path#fromJSON
     * @since 3.0.0
     *
     * @param {Phaser.Types.Curves.JSONPath} data - The JSON object containing the Path data.
     *
     * @return {this} This Path object.
     */
    fromJSON: function (data)
    {
        //  data should be an object matching the Path.toJSON object structure.

        this.curves = [];
        this.cacheLengths = [];

        this.startPoint.set(data.x, data.y);

        this.autoClose = data.autoClose;

        for (var i = 0; i < data.curves.length; i++)
        {
            var curve = data.curves[i];

            switch (curve.type)
            {
                case 'LineCurve':
                    this.add(LineCurve.fromJSON(curve));
                    break;

                case 'EllipseCurve':
                    this.add(EllipseCurve.fromJSON(curve));
                    break;

                case 'SplineCurve':
                    this.add(SplineCurve.fromJSON(curve));
                    break;

                case 'CubicBezierCurve':
                    this.add(CubicBezierCurve.fromJSON(curve));
                    break;

                case 'QuadraticBezierCurve':
                    this.add(QuadraticBezierCurve.fromJSON(curve));
                    break;
            }
        }

        return this;
    },

    /**
     * Returns a Rectangle with a position and size matching the bounds of this Path.
     *
     * @method Phaser.Curves.Path#getBounds
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Geom.Rectangle} [out] - The Rectangle to store the bounds in.
     * @param {number} [accuracy=16] - The accuracy of the bounds calculations. Higher values are more accurate at the cost of calculation speed.
     *
     * @return {Phaser.Geom.Rectangle} The modified `out` Rectangle, or a new Rectangle if none was provided.
     */
    getBounds: function (out, accuracy)
    {
        if (out === undefined) { out = new Rectangle(); }
        if (accuracy === undefined) { accuracy = 16; }

        out.x = Number.MAX_VALUE;
        out.y = Number.MAX_VALUE;

        var bounds = new Rectangle();
        var maxRight = MATH_CONST.MIN_SAFE_INTEGER;
        var maxBottom = MATH_CONST.MIN_SAFE_INTEGER;

        for (var i = 0; i < this.curves.length; i++)
        {
            var curve = this.curves[i];

            if (!curve.active)
            {
                continue;
            }

            curve.getBounds(bounds, accuracy);

            out.x = Math.min(out.x, bounds.x);
            out.y = Math.min(out.y, bounds.y);

            maxRight = Math.max(maxRight, bounds.right);
            maxBottom = Math.max(maxBottom, bounds.bottom);
        }

        out.right = maxRight;
        out.bottom = maxBottom;

        return out;
    },

    /**
     * Returns an array containing the length of the Path at the end of each Curve.
     *
     * The result of this method will be cached to avoid recalculating it in subsequent calls. The cache is only invalidated when the {@link #curves} array changes in length, leading to potential inaccuracies if a Curve in the Path is changed, or if a Curve is removed and another is added in its place.
     *
     * @method Phaser.Curves.Path#getCurveLengths
     * @since 3.0.0
     *
     * @return {number[]} An array containing the length of the Path at the end of each one of its Curves.
     */
    getCurveLengths: function ()
    {
        // We use cache values if curves and cache array are same length

        if (this.cacheLengths.length === this.curves.length)
        {
            return this.cacheLengths;
        }

        // Get length of sub-curve
        // Push sums into cached array

        var lengths = [];
        var sums = 0;

        for (var i = 0; i < this.curves.length; i++)
        {
            sums += this.curves[i].getLength();

            lengths.push(sums);
        }

        this.cacheLengths = lengths;

        return lengths;
    },

    /**
     * Returns the Curve that forms the Path at the given normalized location (between 0 and 1).
     *
     * @method Phaser.Curves.Path#getCurveAt
     * @since 3.60.0
     *
     * @param {number} t - The normalized location on the Path, between 0 and 1.
     *
     * @return {?Phaser.Curves.Curve} The Curve that is part of this Path at a given location, or `null` if no curve was found.
     */
    getCurveAt: function (t)
    {
        var d = t * this.getLength();
        var curveLengths = this.getCurveLengths();
        var i = 0;

        while (i < curveLengths.length)
        {
            if (curveLengths[i] >= d)
            {
                return this.curves[i];
            }

            i++;
        }

        return null;
    },

    /**
     * Returns the ending point of the Path.
     *
     * A Path's ending point is equivalent to the ending point of the last Curve in the Path. For an empty Path, the ending point is at the Path's defined {@link #startPoint}.
     *
     * @method Phaser.Curves.Path#getEndPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - The object to store the point in.
     *
     * @return {Phaser.Math.Vector2} The modified `out` object, or a new Vector2 if none was provided.
     */
    getEndPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        if (this.curves.length > 0)
        {
            this.curves[this.curves.length - 1].getPoint(1, out);
        }
        else
        {
            out.copy(this.startPoint);
        }

        return out;
    },

    /**
     * Returns the total length of the Path.
     *
     * @see {@link #getCurveLengths}
     *
     * @method Phaser.Curves.Path#getLength
     * @since 3.0.0
     *
     * @return {number} The total length of the Path.
     */
    getLength: function ()
    {
        var lens = this.getCurveLengths();

        return lens[lens.length - 1];
    },

    // To get accurate point with reference to
    // entire path distance at time t,
    // following has to be done:

    // 1. Length of each sub path have to be known
    // 2. Locate and identify type of curve
    // 3. Get t for the curve
    // 4. Return curve.getPointAt(t')

    /**
     * Calculates the coordinates of the point at the given normalized location (between 0 and 1) on the Path.
     *
     * The location is relative to the entire Path, not to an individual Curve. A location of 0.5 is always in the middle of the Path and is thus an equal distance away from both its starting and ending points. In a Path with one Curve, it would be in the middle of the Curve; in a Path with two Curves, it could be anywhere on either one of them depending on their lengths.
     *
     * @method Phaser.Curves.Path#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} t - The location of the point to return, between 0 and 1.
     * @param {Phaser.Math.Vector2} [out] - The object in which to store the calculated point.
     *
     * @return {?Phaser.Math.Vector2} The modified `out` object, or a new `Vector2` if none was provided.
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var d = t * this.getLength();
        var curveLengths = this.getCurveLengths();
        var i = 0;

        while (i < curveLengths.length)
        {
            if (curveLengths[i] >= d)
            {
                var diff = curveLengths[i] - d;
                var curve = this.curves[i];

                var segmentLength = curve.getLength();
                var u = (segmentLength === 0) ? 0 : 1 - diff / segmentLength;

                return curve.getPointAt(u, out);
            }

            i++;
        }

        // loop where sum != 0, sum > d , sum+1 <d
        return null;
    },

    /**
     * Get a sequence of points on the path.
     *
     * @method Phaser.Curves.Path#getPoints
     * @since 3.0.0
     *
     * @param {number} [divisions=12] - The number of divisions per resolution per curve.
     *
     * @return {Phaser.Math.Vector2[]} An array of Vector2 objects that containing the points along the Path.
     */
    getPoints: function (divisions)
    {
        if (divisions === undefined) { divisions = 12; }

        var points = [];
        var last;

        for (var i = 0; i < this.curves.length; i++)
        {
            var curve = this.curves[i];

            if (!curve.active)
            {
                continue;
            }

            var resolution = curve.getResolution(divisions);

            var pts = curve.getPoints(resolution);

            for (var j = 0; j < pts.length; j++)
            {
                var point = pts[j];

                if (last && last.equals(point))
                {
                    // ensures no consecutive points are duplicates
                    continue;
                }

                points.push(point);

                last = point;
            }
        }

        if (this.autoClose && points.length > 1 && !points[points.length - 1].equals(points[0]))
        {
            points.push(points[0]);
        }

        return points;
    },

    /**
     * Returns a randomly chosen point anywhere on the path. This follows the same rules as `getPoint` in that it may return a point on any Curve inside this path.
     *
     * When calling this method multiple times, the points are not guaranteed to be equally spaced spatially.
     *
     * @method Phaser.Curves.Path#getRandomPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - `Vector2` instance that should be used for storing the result. If `undefined` a new `Vector2` will be created.
     *
     * @return {Phaser.Math.Vector2} The modified `out` object, or a new `Vector2` if none was provided.
     */
    getRandomPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPoint(Math.random(), out);
    },

    /**
     * Divides this Path into a set of equally spaced points,
     *
     * The resulting points are equally spaced with respect to the points' position on the path, but not necessarily equally spaced spatially.
     *
     * @method Phaser.Curves.Path#getSpacedPoints
     * @since 3.0.0
     *
     * @param {number} [divisions=40] - The amount of points to divide this Path into.
     *
     * @return {Phaser.Math.Vector2[]} A list of the points this path was subdivided into.
     */
    getSpacedPoints: function (divisions)
    {
        if (divisions === undefined) { divisions = 40; }

        var points = [];

        for (var i = 0; i <= divisions; i++)
        {
            points.push(this.getPoint(i / divisions));
        }

        if (this.autoClose)
        {
            points.push(points[0]);
        }

        return points;
    },

    /**
     * Returns the starting point of the Path.
     *
     * @method Phaser.Curves.Path#getStartPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {Phaser.Math.Vector2} [out] - `Vector2` instance that should be used for storing the result. If `undefined` a new `Vector2` will be created.
     *
     * @return {Phaser.Math.Vector2} The modified `out` object, or a new Vector2 if none was provided.
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.startPoint);
    },

    /**
     * Gets a unit vector tangent at a relative position on the path.
     *
     * @method Phaser.Curves.Path#getTangent
     * @since 3.23.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {number} t - The relative position on the path, [0..1].
     * @param {Phaser.Math.Vector2} [out] - A vector to store the result in.
     *
     * @return {Phaser.Math.Vector2} Vector approximating the tangent line at the point t (delta +/- 0.0001)
     */
    getTangent: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var d = t * this.getLength();
        var curveLengths = this.getCurveLengths();
        var i = 0;

        while (i < curveLengths.length)
        {
            if (curveLengths[i] >= d)
            {
                var diff = curveLengths[i] - d;
                var curve = this.curves[i];

                var segmentLength = curve.getLength();
                var u = (segmentLength === 0) ? 0 : 1 - diff / segmentLength;

                return curve.getTangentAt(u, out);
            }

            i++;
        }

        return null;
    },

    /**
     * Creates a line curve from the previous end point to x/y.
     *
     * @method Phaser.Curves.Path#lineTo
     * @since 3.0.0
     *
     * @param {(number|Phaser.Math.Vector2)} x - The X coordinate of the line's end point, or a `Vector2` containing the entire end point.
     * @param {number} [y] - The Y coordinate of the line's end point, if a number was passed as the X parameter.
     *
     * @return {this} This Path object.
     */
    lineTo: function (x, y)
    {
        if (x instanceof Vector2)
        {
            this._tmpVec2B.copy(x);
        }
        else
        {
            this._tmpVec2B.set(x, y);
        }

        var end = this.getEndPoint(this._tmpVec2A);

        return this.add(new LineCurve([ end.x, end.y, this._tmpVec2B.x, this._tmpVec2B.y ]));
    },

    /**
     * Creates a spline curve starting at the previous end point, using the given points on the curve.
     *
     * @method Phaser.Curves.Path#splineTo
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2[]} points - The points the newly created spline curve should consist of.
     *
     * @return {this} This Path object.
     */
    splineTo: function (points)
    {
        points.unshift(this.getEndPoint());

        return this.add(new SplineCurve(points));
    },

    /**
     * Creates a "gap" in this path from the path's current end point to the given coordinates.
     *
     * After calling this function, this Path's end point will be equal to the given coordinates
     *
     * @method Phaser.Curves.Path#moveTo
     * @since 3.0.0
     *
     * @param {(number|Phaser.Math.Vector2)} x - The X coordinate of the position to move the path's end point to, or a `Vector2` containing the entire new end point.
     * @param {number} [y] - The Y coordinate of the position to move the path's end point to, if a number was passed as the X coordinate.
     *
     * @return {this} This Path object.
     */
    moveTo: function (x, y)
    {
        if (x instanceof Vector2)
        {
            return this.add(new MovePathTo(x.x, x.y));
        }
        else
        {
            return this.add(new MovePathTo(x, y));
        }
    },

    /**
     * Converts this Path to a JSON object containing the path information and its constituent curves.
     *
     * @method Phaser.Curves.Path#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.Curves.JSONPath} The JSON object containing this path's data.
     */
    toJSON: function ()
    {
        var out = [];

        for (var i = 0; i < this.curves.length; i++)
        {
            out.push(this.curves[i].toJSON());
        }

        return {
            type: 'Path',
            x: this.startPoint.x,
            y: this.startPoint.y,
            autoClose: this.autoClose,
            curves: out
        };
    },

    /**
     * cacheLengths must be recalculated.
     *
     * @method Phaser.Curves.Path#updateArcLengths
     * @since 3.0.0
     */
    updateArcLengths: function ()
    {
        this.cacheLengths = [];

        this.getCurveLengths();
    },

    /**
     * Disposes of this Path, clearing its internal references to objects so they can be garbage-collected.
     *
     * @method Phaser.Curves.Path#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.curves.length = 0;
        this.cacheLengths.length = 0;
        this.startPoint = undefined;
    }

});

/**
 * Creates a new Path Object.
 *
 * @method Phaser.GameObjects.GameObjectFactory#path
 * @since 3.0.0
 *
 * @param {number} x - The horizontal position of this Path.
 * @param {number} y - The vertical position of this Path.
 *
 * @return {Phaser.Curves.Path} The Path Object that was created.
 */
GameObjectFactory.register('path', function (x, y)
{
    return new Path(x, y);
});

//  When registering a factory function 'this' refers to the GameObjectFactory context.
//
//  There are several properties available to use:
//
//  this.scene - a reference to the Scene that owns the GameObjectFactory
//  this.displayList - a reference to the Display List the Scene owns
//  this.updateList - a reference to the Update List the Scene owns

module.exports = Path;
