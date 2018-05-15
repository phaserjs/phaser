/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var DataManager = require('./DataManager');
var PluginCache = require('../plugins/PluginCache');

/**
 * @classdesc
 * The Data Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 *
 * @class DataManagerPlugin
 * @extends Phaser.Data.DataManager
 * @memberOf Phaser.Data
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var DataManagerPlugin = new Class({

    Extends: DataManager,

    initialize:

    function DataManagerPlugin (scene)
    {
        DataManager.call(this, scene, scene.sys.events);

        /**
         * [description]
         *
         * @name Phaser.Data.DataManagerPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.Data.DataManagerPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.start, this);
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

        this.events.once('destroy', this.destroy, this);
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
        this.events.once('shutdown', this.shutdown, this);
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
        this.systems.events.off('shutdown', this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.Data.DataManagerPlugin#destroy
     * @since 3.5.0
     */
    destroy: function ()
    {
        DataManager.prototype.destroy.call(this);

        this.events.off('start', this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('DataManagerPlugin', DataManagerPlugin, 'data');

module.exports = DataManagerPlugin;
