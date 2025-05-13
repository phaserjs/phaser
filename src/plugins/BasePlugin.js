/**
* @author       Richard Davey <rich@phaser.io>
* @copyright    2013-2025 Phaser Studio Inc.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var Class = require('../utils/Class');

/**
 * @classdesc
 * A Global Plugin is installed just once into the Game owned Plugin Manager.
 * It can listen for Game events and respond to them.
 *
 * @class BasePlugin
 * @memberof Phaser.Plugins
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Plugins.PluginManager} pluginManager - A reference to the Plugin Manager.
 */
var BasePlugin = class {

    constructor(pluginManager)
    {
        /**
         * A handy reference to the Plugin Manager that is responsible for this plugin.
         * Can be used as a route to gain access to game systems and  events.
         *
         * @name Phaser.Plugins.BasePlugin#pluginManager
         * @type {Phaser.Plugins.PluginManager}
         * @protected
         * @since 3.8.0
         */
        this.pluginManager = pluginManager;

        /**
         * A reference to the Game instance this plugin is running under.
         *
         * @name Phaser.Plugins.BasePlugin#game
         * @type {Phaser.Game}
         * @protected
         * @since 3.8.0
         */
        this.game = pluginManager.game;
    }

    /**
     * The PluginManager calls this method on a Global Plugin when the plugin is first instantiated.
     * It will never be called again on this instance.
     * In here you can set-up whatever you need for this plugin to run.
     * If a plugin is set to automatically start then `BasePlugin.start` will be called immediately after this.
     * On a Scene Plugin, this method is never called. Use {@link Phaser.Plugins.ScenePlugin#boot} instead.
     *
     * @method Phaser.Plugins.BasePlugin#init
     * @since 3.8.0
     *
     * @param {?any} [data] - A value specified by the user, if any, from the `data` property of the plugin's configuration object (if started at game boot) or passed in the PluginManager's `install` method (if started manually).
     */
    init()
    {
    }

    /**
     * The PluginManager calls this method on a Global Plugin when the plugin is started.
     * If a plugin is stopped, and then started again, this will get called again.
     * Typically called immediately after `BasePlugin.init`.
     * On a Scene Plugin, this method is never called.
     *
     * @method Phaser.Plugins.BasePlugin#start
     * @since 3.8.0
     */
    start()
    {
        //  Here are the game-level events you can listen to.
        //  At the very least you should offer a destroy handler for when the game closes down.

        // var eventEmitter = this.game.events;

        // eventEmitter.once('destroy', this.gameDestroy, this);
        // eventEmitter.on('pause', this.gamePause, this);
        // eventEmitter.on('resume', this.gameResume, this);
        // eventEmitter.on('resize', this.gameResize, this);
        // eventEmitter.on('prestep', this.gamePreStep, this);
        // eventEmitter.on('step', this.gameStep, this);
        // eventEmitter.on('poststep', this.gamePostStep, this);
        // eventEmitter.on('prerender', this.gamePreRender, this);
        // eventEmitter.on('postrender', this.gamePostRender, this);
    }

    /**
     * The PluginManager calls this method on a Global Plugin when the plugin is stopped.
     * The game code has requested that your plugin stop doing whatever it does.
     * It is now considered as 'inactive' by the PluginManager.
     * Handle that process here (i.e. stop listening for events, etc)
     * If the plugin is started again then `BasePlugin.start` will be called again.
     * On a Scene Plugin, this method is never called.
     *
     * @method Phaser.Plugins.BasePlugin#stop
     * @since 3.8.0
     */
    stop()
    {
    }

    /**
     * Game instance has been destroyed.
     * You must release everything in here, all references, all objects, free it all up.
     *
     * @method Phaser.Plugins.BasePlugin#destroy
     * @since 3.8.0
     */
    destroy()
    {
        this.pluginManager = null;
        this.game = null;
        this.scene = null;
        this.systems = null;
    }

};

module.exports = BasePlugin;
