//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../../utils/Class');
var Curve = require('../Curve');
var FromPoints = require('../../../geom/rectangle/FromPoints');
var Rectangle = require('../../../geom/rectangle/Rectangle');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.Line

var tmpVec2 = new Vector2();

var LineCurve = new Class({

    Extends: Curve,

    initialize:

    //  vec2s or array
    function LineCurve (p0, p1)
    {
        Curve.call(this, 'LineCurve');

        if (Array.isArray(p0))
        {
            p1 = new Vector2(p0[2], p0[3]);
            p0 = new Vector2(p0[0], p0[1]);
        }

        this.p0 = p0;
        this.p1 = p1;
    },

    getBounds: function (out)
    {
        if (out === undefined) { out = new Rectangle(); }

        return FromPoints([ this.p0, this.p1 ], out);
    },

    getStartPoint: function (out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    getResolution: function ()
    {
        return 1;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        if (t === 1)
        {
            return out.copy(this.p1);
        }

        out.copy(this.p1).sub(this.p0).scale(t).add(this.p0);

        return out;
    },

    // Line curve is linear, so we can overwrite default getPointAt
    getPointAt: function (u, out)
    {
        return this.getPoint(u, out);
    },

    getTangent: function ()
    {
        var tangent = tmpVec2.copy(this.p1).sub(this.p0);

        return tangent.normalize();
    },

    //  Override default Curve.draw because this is better than calling getPoints on a line!
    draw: function (graphics)
    {
        graphics.lineBetween(this.p0.x, this.p0.y, this.p1.x, this.p1.y);

        //  So you can chain graphics calls
        return graphics;
    },

    toJSON: function ()
    {
        return {
            type: this.type,
            points: [
                this.p0.x, this.p0.y,
                this.p1.x, this.p1.y
            ]
        };
    }

});

LineCurve.fromJSON = function (data)
{
    var points = data.points;

    var p0 = new Vector2(points[0], points[1]);
    var p1 = new Vector2(points[2], points[3]);

    return new LineCurve(p0, p1);
};

module.exports = LineCurve;
