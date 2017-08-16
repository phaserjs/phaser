var Class = require('../utils/Class');
var NOOP = require('../utils/NOOP');
var Physics = require('../physics');

var PhysicsManager = new Class({

    initialize:

    function PhysicsManager (scene)
    {
        this.scene = scene;

        //  Game level config to start with, then add Scene level config override
        this.config = scene.sys.game.config.physics;

        this.world = { update: NOOP };

        this.add;
    },

    boot: function ()
    {
        var config = this.config;

        if (!config)
        {
            return;
        }

        if (config.system === 'impact')
        {
            this.world = new Physics.Impact.World(this.scene, config);
            this.add = new Physics.Impact.Factory(this.world);
        }
    },

    update: function (time, delta)
    {
        this.world.update(time, delta);
    }

});

module.exports = PhysicsManager;
