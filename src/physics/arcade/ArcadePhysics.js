var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var PluginManager = require('../../plugins/PluginManager');
var World = require('./World');

//  Phaser.Physics.Arcade.ArcadePhysics

var ArcadePhysics = new Class({

    initialize:

    function ArcadePhysics (scene)
    {
        //  The Scene that owns this plugin
        this.scene = scene;

        this.systems = scene.sys;

        this.mapping = 'physics';

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
            GetFastValue(sceneConfig, 'arcade', {}),
            GetFastValue(gameConfig, 'arcade', {})
        );

        return config;
    },

    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.inject(this);

        this.systems.events.on('update', this.world.update, this.world);
        this.systems.events.on('postupdate', this.world.postUpdate, this.world);
        this.systems.events.on('shutdown', this.shutdown, this);
        this.systems.events.on('destroy', this.destroy, this);
    },

    overlap: function (object1, object2, overlapCallback, processCallback, callbackContext)
    {
        if (overlapCallback === undefined) { overlapCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = overlapCallback; }

        return this.world.collideObjects(object1, object2, overlapCallback, processCallback, callbackContext, true);
    },

    collide: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        if (collideCallback === undefined) { collideCallback = null; }
        if (processCallback === undefined) { processCallback = null; }
        if (callbackContext === undefined) { callbackContext = collideCallback; }

        return this.world.collideObjects(object1, object2, collideCallback, processCallback, callbackContext, false);
    },

    //  Utils
    accelerateTo: require('./utils/AccelerateTo'),
    accelerateToObject: require('./utils/AccelerateToObject'),
    closest: require('./utils/Closest'),
    furthest: require('./utils/Furthest'),
    moveTo: require('./utils/MoveTo'),
    moveToObject: require('./utils/MoveToObject'),
    velocityFromAngle: require('./utils/VelocityFromAngle'),
    velocityFromRotation: require('./utils/VelocityFromRotation'),

    shutdown: function ()
    {
        this.world.shutdown();
    },

    destroy: function ()
    {
        this.world.destroy();
    }

});

PluginManager.register('arcadePhysics', ArcadePhysics);

module.exports = ArcadePhysics;
