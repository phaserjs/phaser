//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Curve = require('../Curve');
var Class = require('../../../utils/Class');
var DegToRad = require('../../../math/DegToRad');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.Ellipse

var EllipseCurve = new Class({

    Extends: Curve,

    initialize:

    function EllipseCurve (x, y, xRadius, yRadius, startAngle, endAngle, clockwise, rotation)
    {
        if (yRadius === undefined) { yRadius = xRadius; }
        if (startAngle === undefined) { startAngle = 0; }
        if (endAngle === undefined) { endAngle = 360; }
        if (clockwise === undefined) { clockwise = false; }
        if (rotation === undefined) { rotation = 0; }

        Curve.call(this);

        this.p0 = new Vector2(x, y);

        this._xRadius = xRadius;
        this._yRadius = yRadius;

        //  Radians
        this._startAngle = DegToRad(startAngle);
        this._endAngle = DegToRad(endAngle);

        //  Boolean (anti-clockwise direction)
        this._clockwise = clockwise;

        //  The rotation of the arc
        this._rotation = DegToRad(rotation);

        this._startPoint = this.getPoint(0);
    },

    getStartPoint: function ()
    {
        return this._startPoint;
    },

    getResolution: function (divisions)
    {
        return divisions * 2;
    },

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
            this.getPoint(0, this._startPoint);
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
            this.getPoint(0, this._startPoint);
        }
    },

    startAngle: {
        get: function ()
        {
            return this._startAngle;
        },

        set: function (value)
        {
            this._startAngle = DegToRad(value);
            this.getPoint(0, this._startPoint);
        }
    },

    endAngle: {
        get: function ()
        {
            return this._endAngle;
        },

        set: function (value)
        {
            this._endAngle = DegToRad(value);
            this.getPoint(0, this._startPoint);
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
            this.getPoint(0, this._startPoint);
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
            this.getPoint(0, this._startPoint);
        }
    }

});

module.exports = EllipseCurve;
