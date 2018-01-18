var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var PluginManager = require('../../plugins/PluginManager');
var World = require('./World');

//  Phaser.Physics.Impact.ImpactPhysics

var ImpactPhysics = new Class({

    initialize:

    function ImpactPhysics (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this.config = this.getConfig();

        this.world;

        this.add;
    },

    getConfig: function ()
    {
        var gameConfig = this.systems.game.config.physics;
        var sceneConfig = this.systems.settings.physics;

        var config = Merge(
            GetFastValue(sceneConfig, 'impact', {}),
            GetFastValue(gameConfig, 'impact', {})
        );

        return config;
    },

    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.world.update, this.world);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
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

PluginManager.register('ImpactPhysics', ImpactPhysics, 'impactPhysics');

module.exports = ImpactPhysics;
