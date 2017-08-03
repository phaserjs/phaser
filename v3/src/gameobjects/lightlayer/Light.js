var Class = require('../../utils/Class');

var Light = new Class({

    initialize:

    function Light (x, y, z, r, g, b, attenuation)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.g = g;
        this.b = b;
        this.attenuation = attenuation;
    },

    set: function (x, y, z, r, g, b, attenuation)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.r = r;
        this.g = g;
        this.b = b;
        this.attenuation = attenuation;
    }

});

module.exports = Light;