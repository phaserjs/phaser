//  Based on the three.js Curve classes created by [zz85](http://www.lab4games.net/zz85/blog)

var Class = require('../../../utils/Class');
var Curve = require('../Curve');
var Vector2 = require('../../../math/Vector2');

//  Phaser.Curves.Line

var tmpVec2 = new Vector2();

var LineCurve = new Class({

    Extends: Curve,

    initialize:

    //  vec2s
    function LineCurve (v1, v2)
    {
        Curve.call(this);

        this.v1 = v1;
        this.v2 = v2;
    },

    getResolution: function (divisions)
    {
        return 1;
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        if (t === 1)
        {
            return out.copy(this.v2);
        }

        out.copy(this.v2).sub(this.v1).scale(t).add(this.v1);

        return out;
    },

    // Line curve is linear, so we can overwrite default getPointAt
    getPointAt: function (u, out)
    {
        return this.getPoint(u, out);
    },

    getTangent: function ()
    {
        var tangent = tmpVec2.copy(this.v2).sub(this.v1);

        return tangent.normalize();
    }

});

module.exports = LineCurve;
