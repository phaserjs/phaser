var Class = require('../../../utils/Class');

var RandomZone = new Class({

    initialize:

    function RandomZone (source)
    {
        this.source = source;
    },

    getPoint: function (particle)
    {
        this.source.getRandomPoint(particle);
    }

});

module.exports = RandomZone;
