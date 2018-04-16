/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../utils/Class');
var Curve = require('./Curve');
var DegToRad = require('../math/DegToRad');
var GetValue = require('../utils/object/GetValue');
var RadToDeg = require('../math/RadToDeg');
var Vector2 = require('../math/Vector2');

/**
 * @typedef {object} JSONEllipseCurve
 *
 * @property {string} type - The of the curve.
 * @property {number} x - [description]
 * @property {number} y - [description]
 * @property {number} xRadius - The horizontal radius of ellipse.
 * @property {number} yRadius - The vertical radius of ellipse.
 * @property {integer} startAngle - The start angle of ellipse.
 * @property {integer} endAngle - The end angle of ellipse.
 * @property {boolean} clockwise - The clockwise of ellipse.
 * @property {integer} rotation - The rotation of ellipse.
 */

/**
 * @typedef {object} EllipseCurveConfig
 *
 * @property {number} [x=0] - [description]
 * @property {number} [y=0] - [description]
 * @property {number} [xRadius=0] - [description]
 * @property {number} [yRadius=0] - [description]
 * @property {integer} [startAngle=0] - [description]
 * @property {integer} [endAngle=360] - [description]
 * @property {boolean} [clockwise=false] - [description]
 * @property {integer} [rotation=0] - [description]
  */

/**
 * @classdesc
 * [description]
 *
 * @class EllipseCurve
 * @extends Phaser.Curves.Curve
 * @memberOf Phaser.Curves
 * @constructor
 * @since 3.0.0
 *
 * @param {(number|EllipseCurveConfig)} [x=0] - [description]
 * @param {number} [y=0] - [description]
 * @param {number} [xRadius=0] - [description]
 * @param {number} [yRadius=0] - [description]
 * @param {integer} [startAngle=0] - [description]
 * @param {integer} [endAngle=360] - [description]
 * @param {boolean} [clockwise=false] - [description]
 * @param {integer} [rotation=0] - [description]
 */
var EllipseCurve = new Class({

    Extends: Curve,

    initialize:

    function EllipseCurve (x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation)
    {
        if (typeof x === 'object')
        {
            var config = x;

            x = GetValue(config, 'x', 0);
            y = GetValue(config, 'y', 0);
            xRadius = GetValue(config, 'xRadius', 0);
            yRadius = GetValue(config, 'yRadius', xRadius);
            startAngle = GetValue(config, 'startAngle', 0);
            endAngle = GetValue(config, 'endAngle', 360);
            clockwise = GetValue(config, 'clockwise', false);
            rotation = GetValue(config, 'rotation', 0);
        }
        else
        {
            if (yRadius === undefined) { yRadius = xRadius; }
            if (startAngle === undefined) { startAngle = 0; }
            if (endAngle === undefined) { endAngle = 360; }
            if (clockwise === undefined) { clockwise = false; }
            if (rotation === undefined) { rotation = 0; }
        }

        Curve.call(this, 'EllipseCurve');

        //  Center point

        /**
         * [description]
         *
         * @name Phaser.Curves.EllipseCurve#p0
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.p0 = new Vector2(x, y);

        /**
         * [description]
         *
         * @name Phaser.Curves.EllipseCurve#_xRadius
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._xRadius = xRadius;

        /**
         * [description]
         *
         * @name Phaser.Curves.EllipseCurve#_yRadius
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._yRadius = yRadius;

        //  Radians

        /**
         * [description]
         *
         * @name Phaser.Curves.EllipseCurve#_startAngle
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._startAngle = DegToRad(startAngle);

        /**
         * [description]
         *
         * @name Phaser.Curves.EllipseCurve#_endAngle
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._endAngle = DegToRad(endAngle);

        /**
         * Anti-clockwise direction.
         *
         * @name Phaser.Curves.EllipseCurve#_clockwise
         * @type {boolean}
         * @private
         * @since 3.0.0
         */
        this._clockwise = clockwise;

        /**
         * The rotation of the arc.
         *
         * @name Phaser.Curves.EllipseCurve#_rotation
         * @type {number}
         * @private
         * @since 3.0.0
         */
        this._rotation = DegToRad(rotation);
    },

    /**
     * Gets the starting point on the curve.
     *
     * @method Phaser.Curves.EllipseCurve#getStartPoint
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

        return this.getPoint(0, out);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#getResolution
     * @since 3.0.0
     *
     * @param {number} divisions - [description]
     *
     * @return {number} [description]
     */
    getResolution: function (divisions)
    {
        return divisions * 2;
    },

    /**
     * Get point at relative position in curve according to length.
     *
     * @method Phaser.Curves.EllipseCurve#getPoint
     * @since 3.0.0
     *
     * @generic {Phaser.Math.Vector2} O - [out,$return]
     *
     * @param {float} t - The position along the curve to return. Where 0 is the start and 1 is the end.
     * @param {Phaser.Math.Vector2} [out] - A Vector2 object to store the result in. If not given will be created.
     *
     * @return {Phaser.Math.Vector2} The coordinates of the point on the curve. If an `out` object was given this will be returned.
     */
    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var twoPi = Math.PI * 2;
        var deltaAngle = this._endAngle - this._startAngle;
        var samePoints = Math.abs(deltaAngle) < Number.EPSILON;

        // ensures that deltaAngle is 0 .. 2 PI
        while (deltaAngle < 0)
        {
            deltaAngle += twoPi;
        }

        while (deltaAngle > twoPi)
        {
            deltaAngle -= twoPi;
        }

        if (deltaAngle < Number.EPSILON)
        {
            if (samePoints)
            {
                deltaAngle = 0;
            }
            else
            {
                deltaAngle = twoPi;
            }
        }

        if (this._clockwise && !samePoints)
        {
            if (deltaAngle === twoPi)
            {
                deltaAngle = - twoPi;
            }
            else
            {
                deltaAngle = deltaAngle - twoPi;
            }
        }

        var angle = this._startAngle + t * deltaAngle;
        var x = this.p0.x + this._xRadius * Math.cos(angle);
        var y = this.p0.y + this._yRadius * Math.sin(angle);

        if (this._rotation !== 0)
        {
            var cos = Math.cos(this._rotation);
            var sin = Math.sin(this._rotation);

            var tx = x - this.p0.x;
            var ty = y - this.p0.y;

            // Rotate the point about the center of the ellipse.
            x = tx * cos - ty * sin + this.p0.x;
            y = tx * sin + ty * cos + this.p0.y;
        }

        return out.set(x, y);
    },

    /**
     * Sets the horizontal radius of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setXRadius
     * @since 3.0.0
     *
     * @param {number} value - The horizontal radius of this curve.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setXRadius: function (value)
    {
        this.xRadius = value;

        return this;
    },

    /**
     * Sets the vertical radius of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setYRadius
     * @since 3.0.0
     *
     * @param {number} value - The vertical radius of this curve.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setYRadius: function (value)
    {
        this.yRadius = value;

        return this;
    },

    /**
     * Sets the width of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setWidth
     * @since 3.0.0
     *
     * @param {number} value - The width of this curve.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setWidth: function (value)
    {
        this.xRadius = value * 2;

        return this;
    },

    /**
     * Sets the height of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setHeight
     * @since 3.0.0
     *
     * @param {number} value - The height of this curve.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setHeight: function (value)
    {
        this.yRadius = value * 2;

        return this;
    },

    /**
     * Sets the start angle of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setStartAngle
     * @since 3.0.0
     *
     * @param {number} value - The start angle of this curve, in radians.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setStartAngle: function (value)
    {
        this.startAngle = value;

        return this;
    },

    /**
     * Sets the end angle of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setEndAngle
     * @since 3.0.0
     *
     * @param {number} value - The end angle of this curve, in radians.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setEndAngle: function (value)
    {
        this.endAngle = value;

        return this;
    },

    /**
     * Sets if this curve extends clockwise or anti-clockwise.
     *
     * @method Phaser.Curves.EllipseCurve#setClockwise
     * @since 3.0.0
     *
     * @param {boolean} value - The clockwise state of this curve.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setClockwise: function (value)
    {
        this.clockwise = value;

        return this;
    },

    /**
     * Sets the rotation of this curve.
     *
     * @method Phaser.Curves.EllipseCurve#setRotation
     * @since 3.0.0
     *
     * @param {number} value - The rotation of this curve, in radians.
     *
     * @return {Phaser.Curves.EllipseCurve} This curve object.
     */
    setRotation: function (value)
    {
        this.rotation = value;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.p0.x;
        },

        set: function (value)
        {
            this.p0.x = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.p0.y;
        },

        set: function (value)
        {
            this.p0.y = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#xRadius
     * @type {number}
     * @since 3.0.0
     */
    xRadius: {

        get: function ()
        {
            return this._xRadius;
        },

        set: function (value)
        {
            this._xRadius = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#yRadius
     * @type {number}
     * @since 3.0.0
     */
    yRadius: {

        get: function ()
        {
            return this._yRadius;
        },

        set: function (value)
        {
            this._yRadius = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#startAngle
     * @type {number}
     * @since 3.0.0
     */
    startAngle: {

        get: function ()
        {
            return RadToDeg(this._startAngle);
        },

        set: function (value)
        {
            this._startAngle = DegToRad(value);
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#endAngle
     * @type {number}
     * @since 3.0.0
     */
    endAngle: {

        get: function ()
        {
            return RadToDeg(this._endAngle);
        },

        set: function (value)
        {
            this._endAngle = DegToRad(value);
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#clockwise
     * @type {boolean}
     * @since 3.0.0
     */
    clockwise: {

        get: function ()
        {
            return this._clockwise;
        },

        set: function (value)
        {
            this._clockwise = value;
        }

    },

    /**
     * [description]
     *
     * @name Phaser.Curves.EllipseCurve#rotation
     * @type {number}
     * @since 3.0.0
     */
    rotation: {

        get: function ()
        {
            return this._rotation;
        },

        set: function (value)
        {
            this._rotation = DegToRad(value);
        }

    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#toJSON
     * @since 3.0.0
     *
     * @return {JSONEllipseCurve} The JSON object containing this curve data.
     */
    toJSON: function ()
    {
        return {
            type: this.type,
            x: this.p0.x,
            y: this.p0.y,
            xRadius: this._xRadius,
            yRadius: this._yRadius,
            startAngle: RadToDeg(this._startAngle),
            endAngle: RadToDeg(this._endAngle),
            clockwise: this._clockwise,
            rotation: RadToDeg(this._rotation)
        };
    }

});

/**
 * [description]
 *
 * @function Phaser.Curves.EllipseCurve.fromJSON
 * @since 3.0.0
 *
 * @param {JSONEllipseCurve} data - The JSON object containing this curve data.
 *
 * @return {Phaser.Curves.EllipseCurve} [description]
 */
EllipseCurve.fromJSON = function (data)
{
    return new EllipseCurve(data);
};

module.exports = EllipseCurve;
