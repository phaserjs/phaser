var Class = require('../../../utils/Class');
var Event = require('../../../events/Event');

var CollideEvent = new Class({

    Extends: Event,

    initialize:

    function CollideEvent (bodyA, bodyB, axis)
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

        //  Either 'x' or 'y'
        this.axis = axis;
    }

});

module.exports = CollideEvent;
