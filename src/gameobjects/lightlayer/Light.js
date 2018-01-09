var Class = require('../../utils/Class');

var Light = new Class({

    initialize:

    function Light (x, y, z, radius, r, g, b, attenuation)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
        this.attenuation = attenuation;
        this.scrollFactorX = 1.0;
        this.scrollFactorY = 1.0;
    },

    set: function (x, y, z, radius, r, g, b, attenuation)
    {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = radius;
        this.r = r;
        this.g = g;
        this.b = b;
        this.attenuation = attenuation;
        this.scrollFactorX = 1.0;
        this.scrollFactorY = 1.0;
    }

});

module.exports = Light;
