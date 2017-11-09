//  Phaser.Physics.Arcade.Collider

var Class = require('../../utils/Class');

var Collider = new Class({

    initialize:

    function Collider (world, overlapOnly, object1, object2, collideCallback, processCallback, callbackContext)
    {
        this.world = world;

        this.active = true;

        this.overlapOnly = overlapOnly;

        this.object1 = object1;
        this.object2 = object2;

        this.collideCallback = collideCallback;
        this.processCallback = processCallback;
        this.callbackContext = callbackContext;
    },

    update: function ()
    {
        this.world.collideObjects(
            this.object1,
            this.object2,
            this.collideCallback,
            this.processCallback,
            this.callbackContext,
            this.overlapOnly
        );
    },

    destroy: function ()
    {
        this.world.removeCollider(this);

        this.world = null;

        this.object1 = null;
        this.object2 = null;

        this.collideCallback = null;
        this.processCallback = null;
        this.callbackContext = null;
    }

});

module.exports = Collider;
