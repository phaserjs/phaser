var Class = require('../../utils/Class');
var Vector2 = require('../../math/Vector2');

var MoveTo = new Class({

    initialize:

    function MoveTo (x, y)
    {
        //  Skip length calcs in paths
        this.active = false;

        this.p0 = new Vector2(x, y);
    },

    getPoint: function (t, out)
    {
        if (out === undefined) { out = new Vector2(); }

        return out.copy(this.p0);
    },

    getPointAt: function (u, out)
    {
        return this.getPoint(u, out);
    },

    getResolution: function ()
    {
        return 1;
    },

    getLength: function ()
    {
        return 0;
    },

    toJSON: function ()
    {
        return {
            type: 'MoveTo',
            points: [
                this.p0.x, this.p0.y
            ]
        };
    }

});

module.exports = MoveTo;
