var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var ArcadePhysicsCollideEvent = new Class({

    Extends: Event,

    initialize:

    function ArcadePhysicsCollideEvent (gameObjectA, gameObjectB)
    {
        Event.call(this, 'ARCADE_COLLIDE_EVENT');

        this.gameObjectA = gameObjectA;

        this.gameObjectB = gameObjectB;

        this.bodyA = gameObjectA.body;

        this.bodyB = gameObjectB.body;
    }

});

module.exports = ArcadePhysicsCollideEvent;
