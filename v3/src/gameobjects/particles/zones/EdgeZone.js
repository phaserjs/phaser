var Class = require('../../../utils/Class');
var Wrap = require('../../../math/Wrap');

var EdgeZone = new Class({

    initialize:

    function EdgeZone (source, quantity, stepRate)
    {
        this.source = source;

        this.points = source.getPoints(quantity, stepRate);

        this.counter = 0;
    },

    getPoint: function (particle)
    {
        var point = this.points[this.counter];

        particle.x = point.x;
        particle.y = point.y;

        this.counter = Wrap(this.counter + 1, 0, this.points.length - 1);
    }

});

module.exports = EdgeZone;
