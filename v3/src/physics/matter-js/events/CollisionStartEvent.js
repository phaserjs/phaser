var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var CollisionStartEvent = new Class({

    Extends: Event,

    initialize:

    function CollisionStartEvent (pairs)
    {
        Event.call(this, 'COLLISION_START_EVENT');

        this.pairs = pairs;

        if (pairs.length === 1)
        {
            this.bodyA = pairs[0].bodyA;
            this.bodyB = pairs[0].bodyB;
        }
    }

});

module.exports = CollisionStartEvent;
