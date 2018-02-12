/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Factory = require('./Factory');
var GetFastValue = require('../../utils/object/GetFastValue');
var Merge = require('../../utils/object/Merge');
var PluginManager = require('../../boot/PluginManager');
var World = require('./World');

/**
 * @classdesc
 * [description]
 *
 * @class ImpactPhysics
 * @memberOf Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var ImpactPhysics = new Class({

    initialize:

    function ImpactPhysics (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactPhysics#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactPhysics#systems
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
         * @name Phaser.Physics.Impact.ImpactPhysics#config
         * @type {object}
         * @since 3.0.0
         */
        this.config = this.getConfig();

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactPhysics#world
         * @type {Phaser.Physics.Impact.World}
         * @since 3.0.0
         */
        this.world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactPhysics#add
         * @type {Phaser.Physics.Impact.Factory}
         * @since 3.0.0
         */
        this.add;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.ImpactPhysics#getConfig
     * @since 3.0.0
     *
     * @return {object} [description]
     */
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

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.ImpactPhysics#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        var eventEmitter = this.systems.events;

        eventEmitter.on('update', this.world.update, this.world);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.ImpactPhysics#pause
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Impact.World} The Impact World object.
     */
    pause: function ()
    {
        return this.world.pause();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.ImpactPhysics#resume
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Impact.World} The Impact World object.
     */
    resume: function ()
    {
        return this.world.resume();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.ImpactPhysics#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.world.shutdown();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.ImpactPhysics#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.world.destroy();
    }

});

PluginManager.register('ImpactPhysics', ImpactPhysics, 'impactPhysics');

module.exports = ImpactPhysics;
