var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetValue = require('../../utils/object/GetValue');
var MatterAttractors = require('./lib/plugins/MatterAttractors');
var MatterLib = require('./lib/core/Matter');
var MatterWrap = require('./lib/plugins/MatterWrap');
var Plugin = require('./lib/core/Plugin');
var World = require('./World');

var Matter = new Class({

    initialize:

    //  Referenced from the Scene PhysicsManager as `system`

    function Matter (physicsManager, config)
    {
        this.config = config;

        physicsManager.world = new World(physicsManager.scene, config);

        physicsManager.add = new Factory(physicsManager.world);

        //  Matter plugins

        if (GetValue(config, 'plugins.attractors', false))
        {
            Plugin.register(MatterAttractors);
            Plugin.use(MatterLib, MatterAttractors);
        }

        if (GetValue(config, 'plugins.wrap', false))
        {
            Plugin.register(MatterWrap);
            Plugin.use(MatterLib, MatterWrap);
        }
    },

    enableAttractorPlugin: function ()
    {
        Plugin.register(MatterAttractors);
        Plugin.use(MatterLib, MatterAttractors);

        return this;
    },

    enableWrapPlugin: function ()
    {
        Plugin.register(MatterWrap);
        Plugin.use(MatterLib, MatterWrap);

        return this;
    }

});

module.exports = Matter;
