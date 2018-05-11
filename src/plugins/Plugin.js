/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var Class = require('../utils/Class');

//  A Scene Level Plugin is installed into every Scene and belongs to that Scene.
//  It can listen for Scene events and respond to them.
//  It can map itself to a Scene property, or into the Scene Systems, or both.
//  
//  A Global Plugin is installed just once into the Game owned Plugin Manager.
//  It can listen for Game events and respond to them.

/**
 * @classdesc
 * [description]
 *
 * @class Plugin
 * @memberOf Phaser.Plugins
 * @constructor
 * @since 3.8.0
 *
 * @param {Phaser.Game} game - [description]
 */
var Plugin = new Class({

    initialize:

    function Plugin (key, pluginManager)
    {
        /**
         * The unique (within this game instance) name of this plugin within the Plugin Manager.
         * This is set by the developer in their game config, although you should provide a default value.
         * 
         * @name Phaser.Plugins.Plugin#key
         * @type {string}
         * @since 3.8.0
         */
        this.key = key;

        this.pluginManager = pluginManager;

        /**
         * [description]
         *
         * @name Phaser.Plugins.Plugin#game
         * @type {Phaser.Game}
         * @since 3.8.0
         */
        this.game = pluginManager.game;

        this.active = true;

        // this.sceneConfig = 

        //  The Scene that owns this plugin, if any
        this.scene;

        //  Scene Systems (if any)
        this.systems;
    },

    /**
     * Called when the Game boots. Or, if already booted, called immediately by the PluginManager.
     *
     * @method Phaser.Plugins.Plugin#init
     * @since 3.8.0
     */
    init: function ()
    {
        console.log('Plugin.init');
    },

    /**
     * Called when the Game pauses.
     *
     * @method Phaser.Plugins.Plugin#pauseGame
     * @since 3.8.0
     */
    pauseGame: function ()
    {
    },

    /**
     * Called when the Game resumes from a paused state.
     *
     * @method Phaser.Plugins.Plugin#resumeGame
     * @since 3.8.0
     */
    resumeGame: function ()
    {
    },

    /**
     * Called when the Game resizes.
     *
     * @method Phaser.Plugins.Plugin#resize
     * @since 3.8.0
     */
    resize: function (newWidth, newHeight)
    {
        //  Game instance has been resized
    },

    /**
     * Called when the Game steps.
     * Called automatically by the PluginManager, invoked from the Game.step.
     * Do any continuous processing or updating that you need in here.
     * Not called if Plugin.active = false
     *
     * @method Phaser.Plugins.Plugin#step
     * @since 3.8.0
     */
    step: function (time, delta)
    {
    },

    //  Scene Level ...

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * It's only called if this is a Scene Plugin.
     *
     * @method Phaser.Plugins.Plugin#sceneBoot
     * @since 3.8.0
     */
    sceneBoot: function (scene)
    {
        this.scene = scene;
        this.systems = scene.sys;

        var eventEmitter = scene.sys.events;

        eventEmitter.once('destroy', this.sceneDestroy, this);

        //  Listening to the following events is entirely optional, although we would recommend cleanly shutting down and destroying at least.
        //  If you don't need any of these events then remove the listeners and the relevant methods too.

        eventEmitter.on('start', this.start, this);

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('postupdate', this.postUpdate, this);

        eventEmitter.on('pause', this.pause, this);
        eventEmitter.on('resume', this.resume, this);

        eventEmitter.on('sleep', this.sleep, this);
        eventEmitter.on('wake', this.wake, this);

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },





    /**
     * Game instance has been destroyed.
     * You must release everything in here, all references, all objects, free it all up.
     *
     * @method Phaser.Plugins.Plugin#destroy
     * @since 3.8.0
     */
    destroy: function ()
    {
        this.game = null;
        this.scene = null;
        this.systems = null;
    },


});

module.exports = Plugin;
