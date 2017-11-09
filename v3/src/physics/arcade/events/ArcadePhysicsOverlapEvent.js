var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var ArcadePhysicsOverlapEvent = new Class({

    Extends: Event,

    initialize:

    function ArcadePhysicsOverlapEvent (gameObjectA, gameObjectB)
    {
        Event.call(this, 'ARCADE_OVERLAP_EVENT');

        this.gameObjectA = gameObjectA;

        this.gameObjectB = gameObjectB;

        this.bodyA = gameObjectA.body;

        this.bodyB = gameObjectB.body;
    }

});

module.exports = ArcadePhysicsOverlapEvent;
