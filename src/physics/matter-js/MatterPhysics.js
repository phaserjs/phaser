/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
var PluginCache = require('../../plugins/PluginCache');
var SceneEvents = require('../../scene/events');
var World = require('./World');
var Vertices = require('./lib/geometry/Vertices');

/**
 * @classdesc
 * [description]
 *
 * @class MatterPhysics
 * @memberof Phaser.Physics.Matter
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

        /**
         * A reference to the `Matter.Vertices` module which contains methods for creating and manipulating sets of vertices.
         * A set of vertices is an array of `Matter.Vector` with additional indexing properties inserted by `Vertices.create`.
         * A `Matter.Body` maintains a set of vertices to represent the shape of the object (its convex hull).
         *
         * @name Phaser.Physics.Matter.MatterPhysics#verts
         * @type {MatterJS.Vertices}
         * @since 3.14.0
         */
        this.verts = Vertices;

        //  Matter plugins

        if (GetValue(this.config, 'plugins.attractors', false))
        {
            Plugin.register(MatterAttractors);
            Plugin.use(MatterLib, MatterAttractors);
        }

        if (GetValue(this.config, 'plugins.wrap', false))
        {
            Plugin.register(MatterWrap);
            Plugin.use(MatterLib, MatterWrap);
        }

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.world = new World(this.scene, this.config);
        this.add = new Factory(this.world);

        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        if (!this.world)
        {
            this.world = new World(this.scene, this.config);
            this.add = new Factory(this.world);
        }

        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.UPDATE, this.world.update, this.world);
        eventEmitter.on(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
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
     * @method Phaser.Physics.Matter.MatterPhysics#enableAttractorPlugin
     * @since 3.0.0
     * 
     * @return {Phaser.Physics.Matter.MatterPhysics} This Matter Physics instance.
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
     * 
     * @return {Phaser.Physics.Matter.MatterPhysics} This Matter Physics instance.
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
     * Sets the Matter Engine to run at fixed timestep of 60Hz and enables `autoUpdate`.
     * If you have set a custom `getDelta` function then this will override it.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#set60Hz
     * @since 3.4.0
     *
     * @return {Phaser.Physics.Matter.MatterPhysics} This Matter Physics instance.
     */
    set60Hz: function ()
    {
        this.world.getDelta = this.world.update60Hz;
        this.world.autoUpdate = true;

        return this;
    },

    /**
     * Sets the Matter Engine to run at fixed timestep of 30Hz and enables `autoUpdate`.
     * If you have set a custom `getDelta` function then this will override it.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#set30Hz
     * @since 3.4.0
     *
     * @return {Phaser.Physics.Matter.MatterPhysics} This Matter Physics instance.
     */
    set30Hz: function ()
    {
        this.world.getDelta = this.world.update30Hz;
        this.world.autoUpdate = true;

        return this;
    },

    /**
     * Manually advances the physics simulation by one iteration.
     * 
     * You can optionally pass in the `delta` and `correction` values to be used by Engine.update.
     * If undefined they use the Matter defaults of 60Hz and no correction.
     * 
     * Calling `step` directly bypasses any checks of `enabled` or `autoUpdate`.
     * 
     * It also ignores any custom `getDelta` functions, as you should be passing the delta
     * value in to this call.
     *
     * You can adjust the number of iterations that Engine.update performs internally.
     * Use the Scene Matter Physics config object to set the following properties:
     *
     * positionIterations (defaults to 6)
     * velocityIterations (defaults to 4)
     * constraintIterations (defaults to 2)
     *
     * Adjusting these values can help performance in certain situations, depending on the physics requirements
     * of your game.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#step
     * @since 3.4.0
     *
     * @param {number} [delta=16.666] - [description]
     * @param {number} [correction=1] - [description]
     */
    step: function (delta, correction)
    {
        this.world.step(delta, correction);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.UPDATE, this.world.update, this.world);
        eventEmitter.off(SceneEvents.POST_UPDATE, this.world.postUpdate, this.world);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);

        this.add.destroy();
        this.world.destroy();

        this.add = null;
        this.world = null;
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Physics.Matter.MatterPhysics#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('MatterPhysics', MatterPhysics, 'matterPhysics');

module.exports = MatterPhysics;
