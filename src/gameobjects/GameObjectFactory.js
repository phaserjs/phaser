var Class = require('../utils/Class');
var PluginManager = require('../plugins/PluginManager');

/**
 * [description]
 *
 * @class GameObjectFactory
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs.
 */
var GameObjectFactory = new Class({

    initialize:

    function GameObjectFactory (scene)
    {
        /**
         * The Scene to which this Game Object belongs.
         * Game Objects can only belong to one Scene.
         *
         * @name Phaser.GameObjects.GameObjectFactory#scene
         * @type {Phaser.Scene}
         * @protected
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * A reference to the Scene.Systems.
         *
         * @name Phaser.GameObjects.GameObjectFactory#systems
         * @type {Phaser.Scenes.Systems}
         * @protected
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        this.displayList;

        this.updateList;
    },

    /**
     * Boots the plugin.
     *
     * @method Phaser.GameObjects.GameObjectFactory#boot
     * @private
     * @since 3.0.0
     */
    boot: function ()
    {
        this.displayList = this.systems.displayList;
        this.updateList = this.systems.updateList;

        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * Adds an existing Game Object to this Scene.
     * 
     * If the Game Object renders, it will be added to the Display List.
     * If it has a `preUpdate` method, it will be added to the Update List.
     *
     * @method Phaser.GameObjects.GameObjectFactory#existing
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The child to be added to this Scene.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object that was added.
     */
    existing: function (child)
    {
        if (child.renderCanvas || child.renderWebGL)
        {
            this.displayList.add(child);
        }

        if (child.preUpdate)
        {
            this.updateList.add(child);
        }

        return child;
    },

    /**
     * Shuts this plugin down.
     *
     * @method Phaser.GameObjects.GameObjectFactory#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
    },

    /**
     * Destroys this plugin.
     *
     * @method Phaser.GameObjects.GameObjectFactory#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.scene = null;
        this.displayList = null;
        this.updateList = null;
    }

});

//  Static method called directly by the Game Object factory functions

GameObjectFactory.register = function (type, factoryFunction)
{
    if (!GameObjectFactory.prototype.hasOwnProperty(type))
    {
        GameObjectFactory.prototype[type] = factoryFunction;
    }
};

PluginManager.register('GameObjectFactory', GameObjectFactory, 'add');

module.exports = GameObjectFactory;
