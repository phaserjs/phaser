var Class = require('../../../utils/Class');
var GetFastValue = require('../../../utils/object/GetFastValue');

var RandomZone = new Class({

    initialize:

    function RandomZone (source, steps)
    {
        if (steps === undefined) { steps = 1; }

        this.source = source;

        this.steps = steps;

        this.counter = 0;
    },

    getPoint: function (particle)
    {
    }

});

module.exports = RandomZone;
