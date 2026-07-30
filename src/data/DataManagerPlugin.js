/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var DataManager = require('./DataManager');
var PluginCache = require('../plugins/PluginCache');
var SceneEvents = require('../scene/events');

/**
 * @classdesc
 * The Data Manager Plugin is a Scene Plugin that provides data storage and retrieval
 * functionality for a Scene, integrated with the Scene lifecycle. It extends the base DataManager
 * class with automatic event handling for Scene shutdown and destroy events, ensuring that stored
 * data and event listeners are properly cleaned up when the Scene stops or is destroyed.
 * It is accessed via `scene.data` within any Scene.
 *
 * @class DataManagerPlugin
 * @extends Phaser.Data.DataManager
 * @memberof Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that this DataManager belongs to.
 */
var DataManagerPlugin = new Class({

    Extends: DataManager,

    initialize:

    function DataManagerPlugin (scene)
    {
        DataManager.call(this, scene, scene.sys.events);

        /**
         * A reference to the Scene that this DataManager belongs to.
         *
         * @name Phaser.Data.DataManagerPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene's Systems.
         *
         * @name Phaser.Data.DataManagerPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Data.DataManagerPlugin#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.events = this.systems.events;

        this.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.Data.DataManagerPlugin#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        this.events.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.Data.DataManagerPlugin#shutdown
     * @private
     * @since 3.5.0
     */
    shutdown: function ()
    {
        this.systems.events.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Destroys this DataManagerPlugin, calling the base DataManager destroy method,
     * removing all Scene event listeners, and clearing all internal references.
     * This is called automatically when the owning Scene is destroyed.
     *
     * @method Phaser.Data.DataManagerPlugin#destroy
     * @since 3.5.0
     */
    destroy: function ()
    {
        DataManager.prototype.destroy.call(this);

        this.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('DataManagerPlugin', DataManagerPlugin, 'data');

module.exports = DataManagerPlugin;
