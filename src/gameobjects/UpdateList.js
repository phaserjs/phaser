/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var PluginCache = require('../plugins/PluginCache');
var SceneEvents = require('../scene/events');

/**
 * @classdesc
 * The Update List plugin.
 *
 * Update Lists belong to a Scene and maintain the list Game Objects to be updated every frame.
 *
 * Some or all of these Game Objects may also be part of the Scene's [Display List]{@link Phaser.GameObjects.DisplayList}, for Rendering.
 *
 * @class UpdateList
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that the Update List belongs to.
 */
var UpdateList = new Class({

    initialize:

    function UpdateList (scene)
    {
        /**
         * The Scene that the Update List belongs to.
         *
         * @name Phaser.GameObjects.UpdateList#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The Scene's Systems.
         *
         * @name Phaser.GameObjects.UpdateList#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        /**
         * The list of Game Objects.
         *
         * @name Phaser.GameObjects.UpdateList#_list
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._list = [];

        /**
         * Game Objects that are pending insertion into the list.
         *
         * @name Phaser.GameObjects.UpdateList#_pendingInsertion
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingInsertion = [];

        /**
         * Game Objects that are pending removal from the list.
         *
         * @name Phaser.GameObjects.UpdateList#_pendingRemoval
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingRemoval = [];

        scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
        scene.sys.events.on(SceneEvents.START, this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.GameObjects.UpdateList#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.GameObjects.UpdateList#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.on(SceneEvents.UPDATE, this.update, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * Add a Game Object to the Update List.
     *
     * @method Phaser.GameObjects.UpdateList#add
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to add.
     *
     * @return {Phaser.GameObjects.GameObject} The added Game Object.
     */
    add: function (child)
    {
        //  Is child already in this list?

        if (this._list.indexOf(child) === -1 && this._pendingInsertion.indexOf(child) === -1)
        {
            this._pendingInsertion.push(child);
        }

        return child;
    },

    /**
     * The pre-update step.
     *
     * Handles Game Objects that are pending insertion to and removal from the list.
     *
     * @method Phaser.GameObjects.UpdateList#preUpdate
     * @since 3.0.0
     */
    preUpdate: function ()
    {
        var toRemove = this._pendingRemoval.length;
        var toInsert = this._pendingInsertion.length;

        if (toRemove === 0 && toInsert === 0)
        {
            //  Quick bail
            return;
        }

        var i;
        var gameObject;

        //  Delete old gameObjects
        for (i = 0; i < toRemove; i++)
        {
            gameObject = this._pendingRemoval[i];

            var index = this._list.indexOf(gameObject);

            if (index > -1)
            {
                this._list.splice(index, 1);
            }
        }

        //  Move pending to active
        this._list = this._list.concat(this._pendingInsertion.splice(0));

        //  Clear the lists
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    /**
     * The update step.
     *
     * Pre-updates every active Game Object in the list.
     *
     * @method Phaser.GameObjects.UpdateList#update
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    update: function (time, delta)
    {
        for (var i = 0; i < this._list.length; i++)
        {
            var gameObject = this._list[i];

            if (gameObject.active)
            {
                gameObject.preUpdate.call(gameObject, time, delta);
            }
        }
    },

    /**
     * Remove a Game Object from the list.
     *
     * @method Phaser.GameObjects.UpdateList#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object to remove from the list.
     *
     * @return {Phaser.GameObjects.GameObject} The removed Game Object.
     */
    remove: function (child)
    {
        var index = this._pendingRemoval.indexOf(child);

        if (index !== -1)
        {
            this._pendingRemoval.push(child);
        }

        return child;
    },

    /**
     * Remove all Game Objects from the list.
     *
     * @method Phaser.GameObjects.UpdateList#removeAll
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.UpdateList} This UpdateList.
     */
    removeAll: function ()
    {
        var i = this._list.length;

        while (i--)
        {
            this.remove(this._list[i]);
        }

        return this;
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.GameObjects.UpdateList#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var i = this._list.length;

        while (i--)
        {
            this._list[i].destroy(true);
        }

        i = this._pendingRemoval.length;

        while (i--)
        {
            this._pendingRemoval[i].destroy(true);
        }

        i = this._pendingInsertion.length;

        while (i--)
        {
            this._pendingInsertion[i].destroy(true);
        }

        this._list.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;

        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
        eventEmitter.off(SceneEvents.UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.GameObjects.UpdateList#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    },

    /**
     * The length of the list.
     *
     * @name Phaser.GameObjects.UpdateList#length
     * @type {integer}
     * @readonly
     * @since 3.10.0
     */
    length: {

        get: function ()
        {
            return this._list.length;
        }

    }

});

PluginCache.register('UpdateList', UpdateList, 'updateList');

module.exports = UpdateList;
