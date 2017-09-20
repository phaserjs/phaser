var Curve = require('../Curve');
var Class = require('../../../utils/Class');

var Line = new Class({

    Extends: Curve,

    initialize:

    //  vec3
    function Line (v1, v2)
    {
        this.v1 = v1;
        this.v2 = v2;
    },

    getPoint: function (t)
    {
        if (t === 1)
        {
            return this.v2.clone();
        }

        var point = this.v2.clone().sub(this.v1);

        point.scale(t).add(this.v1);

        return point;
    },

    // Line curve is linear, so we can overwrite default getPointAt
    getPointAt: function (u)
    {
        return this.getPoint(u);
    },

    getTangent: function ()
    {
        var tangent = this.v2.clone().sub(this.v1);

        return tangent.normalize();
    }

});

module.exports = Line;
