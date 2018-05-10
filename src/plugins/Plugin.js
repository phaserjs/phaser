/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2018 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser3-plugin-template/blob/master/LICENSE|MIT License}
*/

var Class = require('../utils/Class');

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

    function Plugin (key, game)
    {
        /**
         * All plugins _must_ set a key property. It's a unique string which is used by the
         * PluginManager to register this plugin, return it and invoke it.
         * It must be unique within the scope of the game instance.
         *
         * @name Phaser.Plugins.Plugin#key
         * @type {string}
         * @since 3.8.0
         */
        this.key = key;

        /**
         * [description]
         *
         * @name Phaser.Plugins.Plugin#game
         * @type {Phaser.Game}
         * @since 3.8.0
         */
        this.game = game;

        this.active = true;

        //  The Scene that owns this plugin, if any
        this.scene;

        //  Scene Systems (if any)
        this.systems;

        if (game.isBooted)
        {
            this.gameBoot();
        }
        else
        {
            game.events.once('boot', this.gameBoot, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Plugins.Plugin#gameBoot
     * @since 3.8.0
     */
    gameBoot: function ()
    {
        console.log('gameBoot');

        this.game.events.on('pause', this.gamePause, this);
        this.game.events.on('resume', this.gameResume, this);
        this.game.events.on('resize', this.gameResize, this);

        this.game.events.once('destroy', this.gameDestroy, this);
    },

    gamePause: function ()
    {
        //  Game instance has paused
    },

    gameResume: function ()
    {
        //  Game instance has resumed from a paused state
    },

    gameResize: function (newWidth, newHeight)
    {
        //  Game instance has been resized
    },

    step: function (time, delta)
    {
        //  Called automatically by the PluginManager, invoked from the Game.step
        //  Do any continuous processing or updating that you need in here
        //  Not called if Plugin.active = false
    },

    /**
     * Game instance has been destroyed.
     *
     * @method Phaser.Plugins.Plugin#gameDestroy
     * @since 3.8.0
     */
    gameDestroy: function ()
    {
        this.game = null;
        this.scene = null;
        this.systems = null;
    },

    //  Scene Level ...

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.Time.Clock#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        if (this.systems)
        {
            this.systems.events.once('destroy', this.destroy, this);
        }
    },


});

module.exports = Plugin;
