/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var CubicBezierCurve = require('../CubicBezierCurve');
var EllipseCurve = require('../EllipseCurve');
var GameObjectFactory = require('../../gameobjects/GameObjectFactory');
var LineCurve = require('../LineCurve');
var MovePathTo = require('./MoveTo');
var Rectangle = require('../../geom/rectangle/Rectangle');
var SplineCurve = require('../SplineCurve');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * [description]
 *
 * @class Path
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {number} [x=0] - [description]
 * @param {number} [y=0] - [description]
 */
var Path = new Class({

    initialize:

    function Path (x, y)
    {
        if (x === undefined) { x = 0; }
        if (y === undefined) { y = 0; }

        /**
         * [description]
         *
         * @name Phaser.Curves.Path#name
         * @type {string}
         * @default ''
         * @since 3.0.0
         */
        this.name = '';

        /**
         * [description]
         *
         * @name Phaser.Curves.Path#curves
         * @type {array}
         * @default []
         * @since 3.0.0
         */
        this.curves = [];

        /**
         * [description]
         *
         * @name Phaser.Curves.Path#cacheLengths
         * @type {array}
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
         * [description]
         *
         * @name {Phaser.MathPhaser.Curves.Path#startPoint
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.startPoint = new Vector2();

        /**
         * [description]
         *
         * @name {Phaser.MathPhaser.Curves.Path#_tmpVec2A
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tmpVec2A = new Vector2();

        /**
         * [description]
         *
         * @name {Phaser.MathPhaser.Curves.Path#_tmpVec2B
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
     * [description]
     *
     * @method Phaser.Curves.Path#add
     * @since 3.0.0
     *
     * @param {Phaser.Curves.Curve} curve - [description]
     *
     * @return {Phaser.Curves.Path} [description]
     */
    add: function (curve)
    {
        this.curves.push(curve);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#circleTo
     * @since 3.0.0
     *
     * @param {number} radius - [description]
     * @param {boolean} [clockwise] - [description]
     * @param {number} [rotation] - [description]
     *
     * @return {Phaser.Curves.Path} [description]
     */
    circleTo: function (radius, clockwise, rotation)
    {
        if (clockwise === undefined) { clockwise = false; }

        return this.ellipseTo(radius, radius, 0, 360, clockwise, rotation);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#closePath
     * @since 3.0.0
     *
     * @return {Phaser.Curves.Path} [description]
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

    //  Creates a cubic bezier curve starting at the previous end point and ending at p3, using p1 and p2 as control points

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#cubicBezierTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {Phaser.Math.Vector2} control1X - {Phaser.Math[description]
     * @param {Phaser.Math.Vector2} control1Y - {Phaser.Math[description]
     * @param {Phaser.Math.Vector2} control2X - {Phaser.Math[description]
     * @param {Phaser.Math.Vector2} control2Y - {Phaser.Math[description]
     *
     * @return {Phaser.Curves.Path} [description]
     */
    cubicBezierTo: function (x, y, control1X, control1Y, control2X, control2Y)
    {
        var p0 = this.getEndPoint();
        var p1;
        var p2;
        var p3;

        //  Assume they're all vec2s
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

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.curves.length = 0;
        this.cacheLengths.length = 0;
        this.startPoint = undefined;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#draw
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.Graphics} graphics - [description]
     * @param {integer} [pointsTotal=32] - [description]
     *
     * @return {Phaser.GameObjects.Graphics} [description]
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
     * @param {number} xRadius - [description]
     * @param {number} yRadius - [description]
     * @param {number} startAngle - [description]
     * @param {number} endAngle - [description]
     * @param {boolean} clockwise - [description]
     * @param {number} rotation - [description]
     *
     * @return {Phaser.Curves.Path} [description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#fromJSON
     * @since 3.0.0
     *
     * @param {object} data - [description]
     *
     * @return {Phaser.Curves.Path} [description]
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
            }
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#getBounds
     * @since 3.0.0
     *
     * @param {Phaser.Geom.Rectangle} [out] - [description]
     * @param {integer} [accuracy=16] - [description]
     *
     * @return {Phaser.Geom.Rectangle} [description]
     */
    getBounds: function (out, accuracy)
    {
        if (out === undefined) { out = new Rectangle(); }
        if (accuracy === undefined) { accuracy = 16; }

        out.x = Number.MAX_VALUE;
        out.y = Number.MAX_VALUE;

        var bounds = new Rectangle();
        var maxRight = Number.MIN_SAFE_INTEGER;
        var maxBottom = Number.MIN_SAFE_INTEGER;

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
     * [description]
     *
     * @method Phaser.Curves.Path#getCurveLengths
     * @since 3.0.0
     *
     * @return {array} [description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#getEndPoint
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} [out] - {Phaser.Math[description]
     *
     * @return {Phaser.Math.Vector2} {Phaser.Math[description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#getLength
     * @since 3.0.0
     *
     * @return {number} [description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#getPoint
     * @since 3.0.0
     *
     * @param {number} t - [description]
     * @param {Phaser.Math.Vector2} [out] - {Phaser.Math[description]
     *
     * @return {Phaser.Math.Vector2|null} [description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#getPoints
     * @since 3.0.0
     *
     * @param {integer} [divisions=12] - [description]
     *
     * @return {Phaser.Math.Vector2[]} [description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#getRandomPoint
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} [out] - {Phaser.Math[description]
     *
     * @return {Phaser.Math.Vector2} {Phaser.Math[description]
     */
    getRandomPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return this.getPoint(Math.random(), out);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#getSpacedPoints
     * @since 3.0.0
     *
     * @param {integer} [divisions=40] - [description]
     *
     * @return {Phaser.Math.Vector2[]} [description]
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
     * [description]
     *
     * @method Phaser.Curves.Path#getStartPoint
     * @since 3.0.0
     *
     * @param {Phaser.Math.Vector2} [out] - {Phaser.Math[description]
     *
     * @return {Phaser.Math.Vector2} {Phaser.Math[description]
     */
    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.startPoint);
    },

    //  Creates a line curve from the previous end point to x/y

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#lineTo
     * @since 3.0.0
     *
     * @param {number|Phaser.Math.Vector2} x - {Phaser.Math[description]
     * @param {number} [y] - [description]
     *
     * @return {Phaser.Curves.Path} [description]
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

    //  Creates a spline curve starting at the previous end point, using the given parameters

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#splineTo
     * @since 3.0.0
     *
     * @param {[type]} points - [description]
     *
     * @return {Phaser.Curves.Path} [description]
     */
    splineTo: function (points)
    {
        points.unshift(this.getEndPoint());

        return this.add(new SplineCurve(points));
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#moveTo
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     *
     * @return {Phaser.Curves.Path} [description]
     */
    moveTo: function (x, y)
    {
        return this.add(new MovePathTo(x, y));
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#toJSON
     * @since 3.0.0
     *
     * @return {object} [description]
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

    // cacheLengths must be recalculated.

    /**
     * [description]
     *
     * @method Phaser.Curves.Path#updateArcLengths
     * @since 3.0.0
     */
    updateArcLengths: function ()
    {
        this.cacheLengths = [];

        this.getCurveLengths();
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
