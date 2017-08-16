var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var CollideEvent = new Class({

    Extends: Event,

    initialize:

    function CollideEvent (bodyA, bodyB)
    {
        Event.call(this, 'COLLIDE_EVENT');

        //  The first body involved in the collision]
        this.bodyA = bodyA;

        //  The second body involved in the collision]
        this.bodyB = bodyB;

        //  The Game Object associated with bodyA (if any)
        this.gameObjectA = bodyA.gameObject;

        //  The Game Object associated with bodyB (if any)
        this.gameObjectB = bodyB.gameObject;
    }

});

module.exports = CollideEvent;
