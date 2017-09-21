//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../../utils/Class');
var CubicBezier = require('../../../math/interpolation/CubicBezierInterpolation');
var Curve = require('../Curve');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.CubicBezier

var CubicBezierCurve = new Class({

    Extends: Curve,

    initialize:

    function CubicBezierCurve (v0, v1, v2, v3)
    {
        Curve.call(this);

        this.v0 = v0;
        this.v1 = v1;
        this.v2 = v2;
        this.v3 = v3;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        var v0 = this.v0;
        var v1 = this.v1;
        var v2 = this.v2;
        var v3 = this.v3;

        return out.set(CubicBezier(t, v0.x, v1.x, v2.x, v3.x), CubicBezier(t, v0.y, v1.y, v2.y, v3.y));
    }

});

module.exports = CubicBezierCurve;
