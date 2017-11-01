var Class = require('../../../utils/Class');
var Vector2 = require('../../../math/Vector2');

var RandomZone = new Class({

    initialize:

    function RandomZone (source)
    {
        this.source = source;

        this._tempVec = new Vector2();
    },

    getPoint: function (particle)
    {
        var vec = this._tempVec;

        this.source.getRandomPoint(vec);

        particle.x = vec.x;
        particle.y = vec.y;
    }

});

module.exports = RandomZone;
