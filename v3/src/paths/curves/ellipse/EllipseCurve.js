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

        this.x = x;
        this.y = y;

        this.xRadius = xRadius;
        this.yRadius = yRadius;

        //  Radians
        this.startAngle = DegToRad(startAngle);
        this.endAngle = DegToRad(endAngle);

        //  Boolean (anti-clockwise direction)
        this.clockwise = clockwise;

        //  The rotation of the arc
        this.rotation = DegToRad(rotation);
    },

    getResolution: function (divisions)
    {
        return divisions * 2;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var twoPi = Math.PI * 2;
        var deltaAngle = this.endAngle - this.startAngle;
        var samePoints = Math.abs( deltaAngle ) < Number.EPSILON;

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

        if (this.clockwise && ! samePoints)
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

        var angle = this.startAngle + t * deltaAngle;
        var x = this.x + this.xRadius * Math.cos(angle);
        var y = this.y + this.yRadius * Math.sin(angle);

        if (this.rotation !== 0)
        {
            var cos = Math.cos(this.rotation);
            var sin = Math.sin(this.rotation);

            var tx = x - this.x;
            var ty = y - this.y;

            // Rotate the point about the center of the ellipse.
            x = tx * cos - ty * sin + this.x;
            y = tx * sin + ty * cos + this.y;
        }

        return out.set(x, y);
    }

});

module.exports = EllipseCurve;
