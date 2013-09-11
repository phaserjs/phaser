/**
* Phaser - PluginManager
*
* TODO: We can optimise this a lot by using separate hashes per function (update, render, etc)
*/

Phaser.PluginManager = function(game, parent) {

    this.game = game;
    this._parent = parent;
    this.plugins = [];
    this._pluginsLength = 0;

};

Phaser.PluginManager.prototype = {

    /**
    * Add a new Plugin to the PluginManager.
    * The plugins game and parent reference are set to this game and pluginmanager parent.
    * @type {Phaser.Plugin}
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

    remove: function (plugin) {

        //  TODO
        this._pluginsLength--;

    },

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

    destroy: function () {

        this.plugins.length = 0;
        this._pluginsLength = 0;
        this.game = null;
        this._parent = null;

    }

};
