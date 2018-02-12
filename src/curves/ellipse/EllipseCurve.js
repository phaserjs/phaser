/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../utils/Class');
var Curve = require('../curve/Curve');
var DegToRad = require('../../math/DegToRad');
var GetValue = require('../../utils/object/GetValue');
var RadToDeg = require('../../math/RadToDeg');
var Vector2 = require('../../math/Vector2');

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
 * @param {number} [x=0] - [description]
 * @param {number} [y=0] - [description]
 * @param {number} [xRadius=0] - [description]
 * @param {number} [yRadius=0] - [description]
 * @param {number} [startAngle=0] - [description]
 * @param {number} [endAngle=360] - [description]
 * @param {boolean} [clockwise=false] - [description]
 * @param {number} [rotation=0] - [description]
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
         * @property {[type]} p0
         * @since 3.0.0
         */
        this.p0 = new Vector2(x, y);

        /**
         * [description]
         *
         * @property {[type]} _xRadius
         * @private
         * @since 3.0.0
         */
        this._xRadius = xRadius;

        /**
         * [description]
         *
         * @property {[type]} _yRadius
         * @private
         * @since 3.0.0
         */
        this._yRadius = yRadius;

        //  Radians

        /**
         * [description]
         *
         * @property {[type]} _startAngle
         * @private
         * @since 3.0.0
         */
        this._startAngle = DegToRad(startAngle);

        /**
         * [description]
         *
         * @property {[type]} _endAngle
         * @private
         * @since 3.0.0
         */
        this._endAngle = DegToRad(endAngle);

        //  Boolean (anti-clockwise direction)

        /**
         * [description]
         *
         * @property {[type]} _clockwise
         * @private
         * @since 3.0.0
         */
        this._clockwise = clockwise;

        //  The rotation of the arc
        this._rotation = DegToRad(rotation);
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#getStartPoint
     * @since 3.0.0
     *
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
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
     * @param {[type]} divisions - [description]
     *
     * @return {[type]} [description]
     */
    getResolution: function (divisions)
    {
        return divisions * 2;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#getPoint
     * @since 3.0.0
     *
     * @param {[type]} t - [description]
     * @param {[type]} out - [description]
     *
     * @return {[type]} [description]
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
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setXRadius
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setXRadius: function (value)
    {
        this.xRadius = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setYRadius
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setYRadius: function (value)
    {
        this.yRadius = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setWidth
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setWidth: function (value)
    {
        this.xRadius = value * 2;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setHeight
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setHeight: function (value)
    {
        this.yRadius = value * 2;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setStartAngle
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setStartAngle: function (value)
    {
        this.startAngle = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setEndAngle
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setEndAngle: function (value)
    {
        this.endAngle = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setClockwise
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setClockwise: function (value)
    {
        this.clockwise = value;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Curves.EllipseCurve#setRotation
     * @since 3.0.0
     *
     * @param {[type]} value - [description]
     *
     * @return {[type]} [description]
     */
    setRotation: function (value)
    {
        this.rotation = value;

        return this;
    },

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
     * @return {[type]} [description]
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

EllipseCurve.fromJSON = function (data)
{
    return new EllipseCurve(data);
};

module.exports = EllipseCurve;
