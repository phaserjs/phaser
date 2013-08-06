/// <reference path="../Game.ts" />
/// <reference path="Plugin.ts" />

/**
* Phaser - PluginManager
*/

module Phaser {

    export class PluginManager {

        constructor(game:Game, parent) {

            this.game = game;

            this._parent = parent;

            this.plugins = [];

        }

        /**
         * Local reference to Game.
         */
        public game: Game;

        /**
         * The object that owns this PluginManager.
         */
        private _parent;

        /**
         * Plugin loop pointer
         * @type {number}
         */
        private _p: number;

        /**
         * Plugins array counter
         * @type {number}
         */
        private _pluginsLength: number;

        /**
         * An Array of Plugins
         * @type {Array}
         */
        public plugins: Phaser.Plugin[];

        /**
         * Add a new Plugin to the PluginManager.
         * The plugins game and parent reference are set to this game and pluginmanager parent.
         * @type {Phaser.Plugin}
         */
        public add(plugin):any {

            var result: bool = false;

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

            if (typeof plugin['postUpdate'] === 'function')
            {
                plugin.hasPostUpdate = true;
                result = true;
            }

            if (typeof plugin['preRender'] === 'function')
            {
                plugin.hasPreRender = true;
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
            if (result == true)
            {
                if (plugin.hasPreUpdate || plugin.hasUpdate || plugin.hasPostUpdate)
                {
                    plugin.active = true;
                }

                if (plugin.hasPreRender || plugin.hasRender || plugin.hasPostRender)
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

        }

        public remove(plugin) {

            //  TODO :)
            this._pluginsLength--;

        }

        public preUpdate() {

            for (this._p = 0; this._p < this._pluginsLength; this._p++)
            {
                if (this.plugins[this._p].active && this.plugins[this._p].hasPreUpdate)
                {
                    this.plugins[this._p].preUpdate();
                }
            }

        }

        public update() {

            for (this._p = 0; this._p < this._pluginsLength; this._p++)
            {
                if (this.plugins[this._p].active && this.plugins[this._p].hasUpdate)
                {
                    this.plugins[this._p].update();
                }
            }

        }

        public postUpdate() {

            for (this._p = 0; this._p < this._pluginsLength; this._p++)
            {
                if (this.plugins[this._p].active && this.plugins[this._p].hasPostUpdate)
                {
                    this.plugins[this._p].postUpdate();
                }
            }

        }

        public preRender() {

            for (this._p = 0; this._p < this._pluginsLength; this._p++)
            {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasPreRender)
                {
                    this.plugins[this._p].preRender();
                }
            }

        }

        public render() {

            for (this._p = 0; this._p < this._pluginsLength; this._p++)
            {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasRender)
                {
                    this.plugins[this._p].render();
                }
            }

        }

        public postRender() {

            for (this._p = 0; this._p < this._pluginsLength; this._p++)
            {
                if (this.plugins[this._p].visible && this.plugins[this._p].hasPostRender)
                {
                    this.plugins[this._p].postRender();
                }
            }

        }

        public destroy() {

            this.plugins.length = 0;
            this._pluginsLength = 0;
            this.game = null;
            this._parent = null;

        }

    }

}