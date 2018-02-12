/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var DataManager = require('./DataManager');
var PluginManager = require('../boot/PluginManager');

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

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        DataManager.call(this, this.scene, scene.sys.events);
    },

    /**
     * [description]
     *
     * @method Phaser.Data.DataManagerPlugin#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdownPlugin, this);
        eventEmitter.on('destroy', this.destroyPlugin, this);
    },

    /**
     * [description]
     *
     * @method Phaser.Data.DataManagerPlugin#shutdownPlugin
     * @since 3.0.0
     */
    shutdownPlugin: function ()
    {
        //  Should we reset the events?
    },

    /**
     * [description]
     *
     * @method Phaser.Data.DataManagerPlugin#destroyPlugin
     * @since 3.0.0
     */
    destroyPlugin: function ()
    {
        this.destroy();

        this.scene = undefined;
        this.systems = undefined;
    }

});

PluginManager.register('DataManagerPlugin', DataManagerPlugin, 'data');

module.exports = DataManagerPlugin;
