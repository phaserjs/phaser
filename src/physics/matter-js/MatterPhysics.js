/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var GetValue = require('../../utils/object/GetValue');
var MatterAttractors = require('./lib/plugins/MatterAttractors');
var MatterLib = require('./lib/core/Matter');
var MatterWrap = require('./lib/plugins/MatterWrap');
var Merge = require('../../utils/object/Merge');
var Plugin = require('./lib/core/Plugin');
var PluginManager = require('../../boot/PluginManager');
var World = require('./World');

/**
 * @classdesc
 * [description]
 *
 * @class MatterPhysics
 * @memberOf Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var MatterPhysics = new Class({

    initialize:

    function MatterPhysics (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.MatterPhysics#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.MatterPhysics#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.MatterPhysics#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = this.getConfig();

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.MatterPhysics#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Matter.MatterPhysics#add
         * @type {Phaser.Physics.Matter.Factory}
         * @since 3.0.0
         */
        this.add;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#getConfig
     * @since 3.0.0
     *
     * @return {object} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#boot
     * @since 3.0.0
     */
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

        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.world.update, this.world);
        eventEmitter.on('postupdate', this.world.postUpdate, this.world);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#enableAttractorPlugin
     * @since 3.0.0
     */
    enableAttractorPlugin: function ()
    {
        Plugin.register(MatterAttractors);
        Plugin.use(MatterLib, MatterAttractors);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#enableWrapPlugin
     * @since 3.0.0
     */
    enableWrapPlugin: function ()
    {
        Plugin.register(MatterWrap);
        Plugin.use(MatterLib, MatterWrap);

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} The Matter World object.
     */
    pause: function ()
    {
        return this.world.pause();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Matter.World} The Matter World object.
     */
    resume: function ()
    {
        return this.world.resume();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.world.shutdown();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Matter.MatterPhysics#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.world.destroy();
    }

});

PluginManager.register('MatterPhysics', MatterPhysics, 'matterPhysics');

module.exports = MatterPhysics;
