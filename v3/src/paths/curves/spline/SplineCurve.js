//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var CatmullRom = require('../../../math/CatmullRom');
var Class = require('../../../utils/Class');
var Curve = require('../Curve');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.Spline

var SplineCurve = new Class({

    Extends: Curve,

    initialize:

    //  Array of vec2s
    function SplineCurve (points)
    {
        if (points === undefined) { points = []; }

        Curve.call(this);

        this.points = points;
    },

    addPoint: function (x, y)
    {
        var vec = new Vector2(x, y);

        this.points.push(vec);

        return vec;
    },

    getStartPoint: function ()
    {
        return this.points[0];
    },

    getResolution: function (divisions)
    {
        return divisions * this.points.length;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var points = this.points;

        var point = (points.length - 1) * t;

        var intPoint = Math.floor(point);

        var weight = point - intPoint;

        var p0 = points[(intPoint === 0) ? intPoint : intPoint - 1];
        var p1 = points[intPoint];
        var p2 = points[(intPoint > points.length - 2) ? points.length - 1 : intPoint + 1];
        var p3 = points[(intPoint > points.length - 3) ? points.length - 1 : intPoint + 2];

        return out.set(CatmullRom(weight, p0.x, p1.x, p2.x, p3.x), CatmullRom(weight, p0.y, p1.y, p2.y, p3.y));
    }

});

module.exports = SplineCurve;
