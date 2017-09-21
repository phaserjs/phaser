//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Curve = require('../Curve');
var Class = require('../../../utils/Class');
var DegToRad = require('../../../math/DegToRad');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.Ellipse

var EllipseCurve = new Class({

    Extends: Curve,

    initialize:

    function EllipseCurve (aX, aY, xRadius, yRadius, aStartAngle, aEndAngle, aClockwise, aRotation)
    {
        if (yRadius === undefined) { yRadius = xRadius; }
        if (aStartAngle === undefined) { aStartAngle = 0; }
        if (aEndAngle === undefined) { aEndAngle = 360; }
        if (aClockwise === undefined) { aClockwise = false; }
        if (aRotation === undefined) { aRotation = 0; }

        Curve.call(this);

        this.aX = aX;
        this.aY = aY;

        this.xRadius = xRadius;
        this.yRadius = yRadius;

        //  Radians
        this.aStartAngle = DegToRad(aStartAngle);
        this.aEndAngle = DegToRad(aEndAngle);

        //  Boolean (anti-clockwise direction)
        this.aClockwise = aClockwise;

        //  The rotation of the arc
        this.aRotation = DegToRad(aRotation);
    },

    getResolution: function (divisions)
    {
        return divisions * 2;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var twoPi = Math.PI * 2;
        var deltaAngle = this.aEndAngle - this.aStartAngle;
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

        if (this.aClockwise && ! samePoints)
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

        var angle = this.aStartAngle + t * deltaAngle;
        var x = this.aX + this.xRadius * Math.cos(angle);
        var y = this.aY + this.yRadius * Math.sin(angle);

        if (this.aRotation !== 0)
        {
            var cos = Math.cos(this.aRotation);
            var sin = Math.sin(this.aRotation);

            var tx = x - this.aX;
            var ty = y - this.aY;

            // Rotate the point about the center of the ellipse.
            x = tx * cos - ty * sin + this.aX;
            y = tx * sin + ty * cos + this.aY;
        }

        return out.set(x, y);
    }

});

module.exports = EllipseCurve;
