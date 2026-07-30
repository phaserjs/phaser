/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var PluginCache = require('../plugins/PluginCache');
var SceneEvents = require('../scene/events');

/**
 * @classdesc
 * The Game Object Creator is a Scene plugin that allows you to quickly create many common
 * types of Game Objects and return them using a configuration object, rather than
 * having to specify individual parameters as required by the GameObjectFactory.
 *
 * Game Objects made via this class are automatically added to the Scene and Update List
 * unless you explicitly set the `add` property in the configuration object to `false`.
 *
 * @class GameObjectCreator
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object Creator belongs.
 */
var GameObjectCreator = new Class({

    initialize:

    function GameObjectCreator (scene)
    {
        /**
         * The Scene to which this Game Object Creator belongs.
         *
         * @name Phaser.GameObjects.GameObjectCreator#scene
         * @type {Phaser.Scene}
         * @protected
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene.Systems.
         *
         * @name Phaser.GameObjects.GameObjectCreator#systems
         * @type {Phaser.Scenes.Systems}
         * @protected
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * A reference to the Scene Event Emitter.
         *
         * @name Phaser.GameObjects.GameObjectCreator#events
         * @type {Phaser.Events.EventEmitter}
         * @protected
         * @since 3.50.0
         */
        this.events = scene.sys.events;

        /**
         * A reference to the Scene Display List.
         *
         * @name Phaser.GameObjects.GameObjectCreator#displayList
         * @type {Phaser.GameObjects.DisplayList}
         * @protected
         * @since 3.0.0
         */
        this.displayList;

        /**
         * A reference to the Scene Update List.
         *
         * @name Phaser.GameObjects.GameObjectCreator#updateList
         * @type {Phaser.GameObjects.UpdateList}
         * @protected
         * @since 3.0.0
         */
        this.updateList;

        this.events.once(SceneEvents.BOOT, this.boot, this);
        this.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.GameObjects.GameObjectCreator#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.displayList = this.systems.displayList;
        this.updateList = this.systems.updateList;

        this.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.GameObjects.GameObjectCreator#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        this.events.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.GameObjects.GameObjectCreator#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.events.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.GameObjects.GameObjectCreator#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
        this.events = null;

        this.displayList = null;
        this.updateList = null;
    }

});

/**
 * Registers a Game Object creator function on the GameObjectCreator prototype,
 * making it available for creating Game Objects via the Scene's make property.
 *
 * @method Phaser.GameObjects.GameObjectCreator.register
 * @static
 * @since 3.0.0
 *
 * @param {string} factoryType - The key of the factory that you will use to call the Phaser.Scene.make[ factoryType ] method.
 * @param {function} factoryFunction - The constructor function to be called when you invoke the Phaser.Scene.make method.
 */
GameObjectCreator.register = function (factoryType, factoryFunction)
{
    if (!GameObjectCreator.prototype.hasOwnProperty(factoryType))
    {
        GameObjectCreator.prototype[factoryType] = factoryFunction;
    }
};

/**
 * Removes a previously registered custom Game Object Creator from the GameObjectCreator prototype,
 * making it no longer available via the Scene's make property.
 *
 * With this method you can remove a custom Game Object Creator that has been previously
 * registered in the Game Object Creator. Pass in its `factoryType` in order to remove it.
 *
 * @method Phaser.GameObjects.GameObjectCreator.remove
 * @static
 * @since 3.0.0
 *
 * @param {string} factoryType - The key of the factory that you want to remove from the GameObjectCreator.
 */
GameObjectCreator.remove = function (factoryType)
{
    if (GameObjectCreator.prototype.hasOwnProperty(factoryType))
    {
        delete GameObjectCreator.prototype[factoryType];
    }
};

PluginCache.register('GameObjectCreator', GameObjectCreator, 'make');

module.exports = GameObjectCreator;
