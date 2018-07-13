/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
declare var EventEmitter: any;
declare var FileTypesManager: {
    install: (loader: any) => void;
    register: (key: any, factoryFunction: any) => void;
    destroy: () => void;
};
declare var GameObjectCreator: any;
declare var GameObjectFactory: any;
declare var GetFastValue: any;
declare var PluginCache: any;
declare var Remove: any;
/**
 * @typedef {object} GlobalPlugin
 *
 * @property {string} key - The unique name of this plugin within the plugin cache.
 * @property {function} plugin - An instance of the plugin.
 * @property {boolean} [active] - Is the plugin active or not?
 * @property {string} [mapping] - If this plugin is to be injected into the Scene Systems, this is the property key map used.
 */
/**
 * @classdesc
 * The PluginManager is responsible for installing and adding plugins to Phaser.
 *
 * It is a global system and therefore belongs to the Game instance, not a specific Scene.
 *
 * It works in conjunction with the PluginCache. Core internal plugins automatically register themselves
 * with the Cache, but it's the Plugin Manager that is responsible for injecting them into the Scenes.
 *
 * There are two types of plugin:
 *
 * 1) A Global Plugin
 * 2) A Scene Plugin
 *
 * A Global Plugin is a plugin that lives within the Plugin Manager rather than a Scene. You can get
 * access to it by calling `PluginManager.get` and providing a key. Any Scene that requests a plugin in
 * this way will all get access to the same plugin instance, allowing you to use a single plugin across
 * multiple Scenes.
 *
 * A Scene Plugin is a plugin dedicated to running within a Scene. These are different to Global Plugins
 * in that their instances do not live within the Plugin Manager, but within the Scene Systems class instead.
 * And that every Scene created is given its own unique instance of a Scene Plugin. Examples of core Scene
 * Plugins include the Input Plugin, the Tween Plugin and the physics Plugins.
 *
 * You can add a plugin to Phaser in three different ways:
 *
 * 1) Preload it
 * 2) Include it in your source code and install it via the Game Config
 * 3) Include it in your source code and install it within a Scene
 *
 * For examples of all of these approaches please see the Phaser 3 Examples Repo `plugins` folder.
 *
 * For information on creating your own plugin please see the Phaser 3 Plugin Template.
 *
 * @class PluginManager
 * @memberOf Phaser.Plugins
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - The game instance that owns this Plugin Manager.
 */
declare var PluginManager: any;
