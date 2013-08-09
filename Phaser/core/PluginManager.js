/// <reference path="../_definitions.ts" />
/**
* Phaser - PluginManager
*/
var Phaser;
(function (Phaser) {
    var PluginManager = (function () {
        function PluginManager(game, parent) {
            this.game = game;

            this._parent = parent;

            this.plugins = [];
        }
        /**
        * Add a new Plugin to the PluginManager.
        * The plugins game and parent reference are set to this game and pluginmanager parent.
        * @type {Phaser.Plugin}
        */
        PluginManager.prototype.add = function (plugin) {
            var result = false;

            if (typeof plugin === 'function') {
                plugin = new plugin(this.game, this._parent);
            } else {
                plugin.game = this.game;
                plugin.parent = this._parent;
            }

            if (typeof plugin['preUpdate'] === 'function') {
                plugin.hasPreUpdate = true;
                result = true;
            }

            if (typeof plugin['update'] === 'function') {
                plugin.hasUpdate = true;
                result = true;
            }

            if (typeof plugin['postUpdate'] === 'function') {
                plugin.hasPostUpdate = true;
                result = true;
            }

            if (typeof plugin['preRender'] === 'function') {
                plugin.hasPreRender = true;
                result = true;
            }

            if (typeof plugin['render'] === 'function') {
                plugin.hasRender = true;
                result = true;
            }

            if (typeof plugin['postRender'] === 'function') {
                plugin.hasPostRender = true;
                result = true;
            }

            if (result == true) {
                if (plugin.hasPreUpdate || plugin.hasUpdate || plugin.hasPostUpdate) {
                    plugin.active = true;
                }

                if (plugin.hasPreRender || plugin.hasRender || plugin.hasPostRender) {
                    plugin.visible = true;
                }

                this._pluginsLength = this.plugins.push(plugin);

                return plugin;
            } else {
                return null;
            }
        };

        PluginManager.prototype.remove = function (plugin) {
            //  TODO :)
            this._pluginsLength--;
        };

        PluginManager.prototype.preUpdate = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].active && this.plugins[this._p].hasPreUpdate) {
                    this.plugins[this._p].preUpdate();
                }
            }
        };

        PluginManager.prototype.update = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].active && this.plugins[this._p].hasUpdate) {
                    this.plugins[this._p].update();
                }
            }
        };

        PluginManager.prototype.postUpdate = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].active && this.plugins[this._p].hasPostUpdate) {
                    this.plugins[this._p].postUpdate();
                }
            }
        };

        PluginManager.prototype.preRender = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasPreRender) {
                    this.plugins[this._p].preRender();
                }
            }
        };

        PluginManager.prototype.render = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasRender) {
                    this.plugins[this._p].render();
                }
            }
        };

        PluginManager.prototype.postRender = function () {
            for (this._p = 0; this._p < this._pluginsLength; this._p++) {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasPostRender) {
                    this.plugins[this._p].postRender();
                }
            }
        };

        PluginManager.prototype.destroy = function () {
            this.plugins.length = 0;
            this._pluginsLength = 0;
            this.game = null;
            this._parent = null;
        };
        return PluginManager;
    })();
    Phaser.PluginManager = PluginManager;
})(Phaser || (Phaser = {}));
