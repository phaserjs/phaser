var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var ArcadePhysicsWorldBoundsEvent = new Class({

    Extends: Event,

    initialize:

    function ArcadePhysicsWorldBoundsEvent (body)
    {
        Event.call(this, 'ARCADE_WORLD_BOUNDS_EVENT');

        this.gameObject = body.gameObject;

        this.body = body;

        this.blockedUp = body.blocked.up;
        this.blockedDown = body.blocked.down;
        this.blockedLeft = body.blocked.left;
        this.blockedRight = body.blocked.right;
    }

});

module.exports = ArcadePhysicsWorldBoundsEvent;
