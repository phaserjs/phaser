/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var LightsManager = require('./LightsManager');
var PluginCache = require('../../plugins/PluginCache');

/**
 * @classdesc
 * [description]
 *
 * @class LightsPlugin
 * @extends Phaser.GameObjects.LightsManager
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var LightsPlugin = new Class({

    Extends: LightsManager,

    initialize:

    function LightsPlugin (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsPlugin#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.LightsPlugin#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        LightsManager.call(this);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.LightsPlugin#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.LightsPlugin#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
        this.systems = undefined;
    }

});

PluginCache.register('LightsPlugin', LightsPlugin, 'lights');

module.exports = LightsPlugin;
