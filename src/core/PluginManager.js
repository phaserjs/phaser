/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
* @module       Phaser.PluginManager
*/

/** 
* Description.
* 
* @class Phaser.PluginManager
* @classdesc PPhaser - PluginManager
* @constructor
* @param {Phaser.Game} game - A reference to the currently running game.
* @param {Description} parent - Description.
*/
Phaser.PluginManager = function(game, parent) {

	/**
	* @property {Phaser.Game} game - A reference to the currently running game.
	*/
    this.game = game;
    
    /**
	* @property {Description} _parent - Description.
	* @private
	*/
    this._parent = parent;
    
    /**
	* @property {array} plugins - Description.
	*/
    this.plugins = [];
    
    /**
	* @property {array} _pluginsLength - Description.
	* @private
	* @default
	*/
    this._pluginsLength = 0;

};

Phaser.PluginManager.prototype = {

    /**
    * Add a new Plugin to the PluginManager.
    * The plugin's game and parent reference are set to this game and pluginmanager parent.
    * @method add
    * @memberof Phaser.PluginManager
    * @param {Phaser.Plugin} plugin - Description.
    * @return {Phaser.Plugin} Description.
    */
    add: function (plugin) {

        var result = false;

        //  Prototype?
        if (typeof plugin === 'function')
        {
            plugin = new plugin(this.game, this._parent);
        }
        else
        {
            plugin.game = this.game;
            plugin.parent = this._parent;
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
            if (plugin.hasPreUpdate || plugin.hasUpdate)
            {
                plugin.active = true;
            }

            if (plugin.hasRender || plugin.hasPostRender)
            {
                plugin.visible = true;
            }

            this._pluginsLength = this.plugins.push(plugin);
            return plugin;
        }
        else
        {
            return null;
        }
    },

    /**
     * Remove a Plugin from the PluginManager.
     * @method remove
     * @memberof Phaser.PluginManager
     * @param {Phaser.Plugin} plugin - Description.
     */
    remove: function (plugin) {

        //  TODO
        this._pluginsLength--;

    },

    /**
    * Description.
    * 
    * @method preUpdate
    * @memberof Phaser.PluginManager
    */
    preUpdate: function () {

        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].active && this.plugins[this._p].hasPreUpdate)
            {
                this.plugins[this._p].preUpdate();
            }
        }

    },

    /**
    * Description.
    * 
    * @method update
    * @memberof Phaser.PluginManager
    */
    update: function () {
        
        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].active && this.plugins[this._p].hasUpdate)
            {
                this.plugins[this._p].update();
            }
        }

    },

    /**
    * Description.
    * 
    * @method render
    * @memberof Phaser.PluginManager
    */
    render: function () {

        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].visible && this.plugins[this._p].hasRender)
            {
                this.plugins[this._p].render();
            }
        }

    },

    /**
    * Description.
    * 
    * @method postRender
    * @memberof Phaser.PluginManager
    */
    postRender: function () {

        if (this._pluginsLength == 0)
        {
            return;
        }

        for (this._p = 0; this._p < this._pluginsLength; this._p++)
        {
            if (this.plugins[this._p].visible && this.plugins[this._p].hasPostRender)
            {
                this.plugins[this._p].postRender();
            }
        }

    },

    /**
    * Description.
    * 
    * @method destroy
    * @memberof Phaser.PluginManager
    */
    destroy: function () {

        this.plugins.length = 0;
        this._pluginsLength = 0;
        this.game = null;
        this._parent = null;

    }

};
