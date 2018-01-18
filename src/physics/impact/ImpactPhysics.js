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
            GetFastValue(sceneConfig, 'impact', {}),
            GetFastValue(gameConfig, 'impact', {})
        );

        return config;
    },

    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.events.on('update', this.world.update, this.world);
        this.systems.events.on('shutdown', this.shutdown, this);
        this.systems.events.on('destroy', this.destroy, this);
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
