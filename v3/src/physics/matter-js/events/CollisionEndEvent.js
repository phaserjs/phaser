var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var CollisionEndEvent = new Class({

    Extends: Event,

    initialize:

    function CollisionEndEvent (pairs)
    {
        Event.call(this, 'COLLISION_END_EVENT');

        this.pairs = pairs;

        if (pairs.length > 0)
        {
            this.bodyA = pairs[0].bodyA;
            this.bodyB = pairs[0].bodyB;
        }
    }

});

module.exports = CollisionEndEvent;
