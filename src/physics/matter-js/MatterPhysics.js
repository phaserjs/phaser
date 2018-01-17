var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MatterAttractors = require('./lib/plugins/MatterAttractors');
var MatterLib = require('./lib/core/Matter');
var MatterWrap = require('./lib/plugins/MatterWrap');
var Merge = require('../../utils/object/Merge');
var Plugin = require('./lib/core/Plugin');
var PluginManager = require('../../plugins/PluginManager');
var World = require('./World');

//  Phaser.Physics.Matter.MatterPhysics

var MatterPhysics = new Class({

    initialize:

    //  Referenced from the Scene PhysicsManager as `system`

    function MatterPhysics (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        this.mapping = 'matter';

        this.systems.events.on('boot', this.boot, this);

        this.config = this.getConfig();

        this.world;

        this.add;
    },

    getConfig: function ()
    {
        var gameConfig = this.systems.game.config.physics;
        var sceneConfig = this.systems.settings.physics;

        var config = Merge(
            GetFastValue(sceneConfig, 'matter', {}),
            GetFastValue(gameConfig, 'matter', {})
        );

        return config;
    },

    boot: function ()
    {
        var config = this.config;

        this.world = new World(this.scene, config);
        this.add = new Factory(this.world);

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

        this.systems.inject(this);

        this.systems.events.on('update', this.update, this);
        this.systems.events.on('postupdate', this.postUpdate, this);
        this.systems.events.on('shutdown', this.shutdown, this);
        this.systems.events.on('destroy', this.destroy, this);
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
    },

    update: function (time, delta)
    {
        this.world.update(time, delta);
    },

    postUpdate: function (time, delta)
    {
        this.world.postUpdate(time, delta);
    },

    shutdown: function ()
    {
        this.world.shutdown();
    },

    destroy: function ()
    {
        this.world.destroy();
    }

});

PluginManager.register('matterPhysics', MatterPhysics);

module.exports = MatterPhysics;
