var Class = require('../../utils/Class');
var GetValue = require('../../utils/object/GetValue');
var Merge = require('../../utils/object/Merge');
var NOOP = require('../../utils/NOOP');

//  Physics Systems (TODO: Remove from here)
var Arcade = require('../../physics/arcade/Arcade');
var Impact = require('../../physics/impact/Impact');
var Matter = require('../../physics/matter-js/Matter');

var PhysicsManager = new Class({

    initialize:

    function PhysicsManager (scene)
    {
        this.scene = scene;

        this.gameConfig = scene.sys.game.config.physics;
        this.defaultSystem = scene.sys.game.config.defaultPhysicsSystem;
        this.sceneConfig = scene.sys.settings.physics;

        //  This gets set to an instance of the physics system during boot
        this.system;

        //  This gets set by the physics system during boot
        this.world = { update: NOOP, postUpdate: NOOP };

        //  This gets set by the physics system during boot
        this.add;
    },

    boot: function ()
    {
        var sceneSystem = GetValue(this.sceneConfig, 'system', false);

        if (!this.defaultSystem && !sceneSystem)
        {
            //  No default physics system or system in this scene, so abort
            return;
        }

        //  Which physics system are we using in this Scene?
        var system = (sceneSystem !== false) ? sceneSystem : this.defaultSystem;

        //  Create the config for it
        var config = Merge(this.sceneConfig, GetValue(this.gameConfig, system, {}));

        switch (system)
        {
            case 'arcade':
                this.system = new Arcade(this, config);
                break;

            case 'impact':
                this.system = new Impact(this, config);
                break;

            case 'matter':
                this.system = new Matter(this, config);
                break;
        }
    },

    update: function (time, delta)
    {
        this.world.update(time, delta);
    },

    postUpdate: function ()
    {
        this.world.postUpdate();
    }

});

module.exports = PhysicsManager;
