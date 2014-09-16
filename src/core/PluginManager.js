/* jshint newcap: false */

/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2014 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/

/**
* The Plugin Manager is responsible for the loading, running and unloading of Phaser Plugins.
*
* @class Phaser.PluginManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
*/
Phaser.PluginManager = function(game) {

    /**
    * @property {Phaser.Game} game - A reference to the currently running game.
    */
    this.game = game;

    /**
    * @property {array} plugins - An array of all the plugins being managed by this PluginManager.
    */
    this.plugins = [];

    /**
    * @property {number} _len - Internal cache var.
    * @private
    */
    this._len = 0;

    /**
    * @property {number} _i - Internal cache var.
    * @private
    */
    this._i = 0;

};

Phaser.PluginManager.prototype = {

    /**
    * Add a new Plugin into the PluginManager.
    * The Plugin must have 2 properties: game and parent. Plugin.game is set to the game reference the PluginManager uses, and parent is set to the PluginManager.
    *
    * @method Phaser.PluginManager#add
    * @param {object|Phaser.Plugin} plugin - The Plugin to add into the PluginManager. This can be a function or an existing object.
    * @param {...*} parameter - Additional parameters that will be passed to the Plugin.init method.
    * @return {Phaser.Plugin} The Plugin that was added to the manager.
    */
    add: function (plugin) {

        var args = Array.prototype.splice.call(arguments, 1);
        var result = false;

        //  Prototype?
        if (typeof plugin === 'function')
        {
            plugin = new plugin(this.game, this);
        }
        else
        {
            plugin.game = this.game;
            plugin.parent = this;
        }

        //  Check for methods now to avoid having to do this every loop
        if (typeof plugin['preUpdate'] === 'function')
        {
            plugin.hasPreUpdate = true;
            result = true;
        }

        if (typeof plugin['update'] === 'function')
        {
            plugin.hasUpdate = true;
            result = true;
        }

        if (typeof plugin['postUpdate'] === 'function')
        {
            plugin.hasPostUpdate = true;
            result = true;
        }

        if (typeof plugin['render'] === 'function')
        {
            plugin.hasRender = true;
            result = true;
        }

        if (typeof plugin['postRender'] === 'function')
        {
            plugin.hasPostRender = true;
            result = true;
        }

        //  The plugin must have at least one of the above functions to be added to the PluginManager.
        if (result)
        {
            if (plugin.hasPreUpdate || plugin.hasUpdate || plugin.hasPostUpdate)
            {
                plugin.active = true;
            }

            if (plugin.hasRender || plugin.hasPostRender)
            {
                plugin.visible = true;
            }

            this._len = this.plugins.push(plugin);

            // Allows plugins to run potentially destructive code outside of the constructor, and only if being added to the PluginManager
            if (typeof plugin['init'] === 'function')
            {
                plugin.init.apply(plugin, args);
            }

            return plugin;
        }
        else
        {
            return null;
        }
    },

    /**
    * Remove a Plugin from the PluginManager. It calls Plugin.destroy on the plugin before removing it from the manager.
    *
    * @method Phaser.PluginManager#remove
    * @param {Phaser.Plugin} plugin - The plugin to be removed.
    */
    remove: function (plugin) {

        this._i = this._len;

        while (this._i--)
        {
            if (this.plugins[this._i] === plugin)
            {
                plugin.destroy();
                this.plugins.splice(this._i, 1);
                this._len--;
                return;
            }
        }

    },

    /**
    * Remove all Plugins from the PluginManager. It calls Plugin.destroy on every plugin before removing it from the manager.
    *
    * @method Phaser.PluginManager#removeAll
    */
    removeAll: function() {

        this._i = this._len;

        while (this._i--)
        {
            this.plugins[this._i].destroy();
        }

        this.plugins.length = 0;
        this._len = 0;

    },

    /**
    * Pre-update is called at the very start of the update cycle, before any other subsystems have been updated (including Physics).
    * It only calls plugins who have active=true.
    *
    * @method Phaser.PluginManager#preUpdate
    */
    preUpdate: function () {

        this._i = this._len;

        while (this._i--)
        {
            if (this.plugins[this._i].active && this.plugins[this._i].hasPreUpdate)
            {
                this.plugins[this._i].preUpdate();
            }
        }

    },

    /**
    * Update is called after all the core subsystems (Input, Tweens, Sound, etc) and the State have updated, but before the render.
    * It only calls plugins who have active=true.
    *
    * @method Phaser.PluginManager#update
    */
    update: function () {

        this._i = this._len;

        while (this._i--)
        {
            if (this.plugins[this._i].active && this.plugins[this._i].hasUpdate)
            {
                this.plugins[this._i].update();
            }
        }

    },

    /**
    * PostUpdate is the last thing to be called before the world render.
    * In particular, it is called after the world postUpdate, which means the camera has been adjusted.
    * It only calls plugins who have active=true.
    *
    * @method Phaser.PluginManager#postUpdate
    */
    postUpdate: function () {

        this._i = this._len;

        while (this._i--)
        {
            if (this.plugins[this._i].active && this.plugins[this._i].hasPostUpdate)
            {
                this.plugins[this._i].postUpdate();
            }
        }

    },

    /**
    * Render is called right after the Game Renderer completes, but before the State.render.
    * It only calls plugins who have visible=true.
    *
    * @method Phaser.PluginManager#render
    */
    render: function () {

        this._i = this._len;

        while (this._i--)
        {
            if (this.plugins[this._i].visible && this.plugins[this._i].hasRender)
            {
                this.plugins[this._i].render();
            }
        }

    },

    /**
    * Post-render is called after the Game Renderer and State.render have run.
    * It only calls plugins who have visible=true.
    *
    * @method Phaser.PluginManager#postRender
    */
    postRender: function () {

        this._i = this._len;

        while (this._i--)
        {
            if (this.plugins[this._i].visible && this.plugins[this._i].hasPostRender)
            {
                this.plugins[this._i].postRender();
            }
        }

    },

    /**
    * Clear down this PluginManager, calls destroy on every plugin and nulls out references.
    *
    * @method Phaser.PluginManager#destroy
    */
    destroy: function () {

        this.removeAll();

        this.game = null;

    }

};

Phaser.PluginManager.prototype.constructor = Phaser.PluginManager;
