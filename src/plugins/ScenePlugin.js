/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2020 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var BasePlugin = require('./BasePlugin');
var Class = require('../utils/Class');
var SceneEvents = require('../scene/events');

/**
 * @classdesc
 * A Scene Level Plugin is installed into every Scene and belongs to that Scene.
 * It can listen for Scene events and respond to them.
 * It can map itself to a Scene property, or into the Scene Systems, or both.
 *
 * @class ScenePlugin
 * @memberof Phaser.Plugins
 * @extends Phaser.Plugins.BasePlugin
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Scene} scene - A reference to the Scene that has installed this plugin.
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Plugin Manager.
 */
var ScenePlugin = new Class({

    Extends: BasePlugin,

    initialize:

    function ScenePlugin (scene, pluginManager)
    {
        BasePlugin.call(this, pluginManager);

        /**
         * A reference to the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You can use it during the `boot` method.
         *
         * @name Phaser.Plugins.ScenePlugin#scene
         * @type {?Phaser.Scene}
         * @protected
         * @since 3.8.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene Systems of the Scene that has installed this plugin.
         * Only set if it's a Scene Plugin, otherwise `null`.
         * This property is only set when the plugin is instantiated and added to the Scene, not before.
         * You can use it during the `boot` method.
         *
         * @name Phaser.Plugins.ScenePlugin#systems
         * @type {?Phaser.Scenes.Systems}
         * @protected
         * @since 3.8.0
         */
        this.systems = scene.sys;

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
    },

    /**
     * This method is called when the Scene boots. It is only ever called once.
     *
     * By this point the plugin properties `scene` and `systems` will have already been set.
     *
     * In here you can listen for {@link Phaser.Scenes.Events Scene events} and set-up whatever you need for this plugin to run.
     * Here are the Scene events you can listen to:
     *
     * - start
     * - ready
     * - preupdate
     * - update
     * - postupdate
     * - resize
     * - pause
     * - resume
     * - sleep
     * - wake
     * - transitioninit
     * - transitionstart
     * - transitioncomplete
     * - transitionout
     * - shutdown
     * - destroy
     *
     * At the very least you should offer a destroy handler for when the Scene closes down, i.e:
     *
     * ```javascript
     * var eventEmitter = this.systems.events;
     * eventEmitter.once('destroy', this.sceneDestroy, this);
     * ```
     *
     * @method Phaser.Plugins.ScenePlugin#boot
     * @since 3.8.0
     */
    boot: function ()
    {
    },

    /**
     * Game instance has been destroyed.
     * 
     * You must release everything in here, all references, all objects, free it all up.
     *
     * @method Phaser.Plugins.ScenePlugin#destroy
     * @since 3.8.0
     */
    destroy: function ()
    {
        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

});

module.exports = ScenePlugin;
