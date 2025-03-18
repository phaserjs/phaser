/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../utils/Class');
var ProcessQueue = require('../structs/ProcessQueue');
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
 * @extends Phaser.Structs.ProcessQueue.<Phaser.GameObjects.GameObject>
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that the Update List belongs to.
 */
var UpdateList = new Class({

    Extends: ProcessQueue,

    initialize:

    function UpdateList (scene)
    {
        ProcessQueue.call(this);

        //  No duplicates in this list
        this.checkQueue = true;

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
         * The `pending` list is a selection of items which are due to be made 'active' in the next update.
         *
         * @name Phaser.GameObjects.UpdateList#_pending
         * @type {Array.<*>}
         * @private
         * @default []
         * @since 3.20.0
         */

        /**
         * The `active` list is a selection of items which are considered active and should be updated.
         *
         * @name Phaser.GameObjects.UpdateList#_active
         * @type {Array.<*>}
         * @private
         * @default []
         * @since 3.20.0
         */

        /**
         * The `destroy` list is a selection of items that were active and are awaiting being destroyed in the next update.
         *
         * @name Phaser.GameObjects.UpdateList#_destroy
         * @type {Array.<*>}
         * @private
         * @default []
         * @since 3.20.0
         */

        /**
         * The total number of items awaiting processing.
         *
         * @name Phaser.GameObjects.UpdateList#_toProcess
         * @type {number}
         * @private
         * @default 0
         * @since 3.0.0
         */

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

        eventEmitter.on(SceneEvents.PRE_UPDATE, this.update, this);
        eventEmitter.on(SceneEvents.UPDATE, this.sceneUpdate, this);
        eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The update step.
     *
     * Pre-updates every active Game Object in the list.
     *
     * @method Phaser.GameObjects.UpdateList#sceneUpdate
     * @since 3.20.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time elapsed since the last frame.
     */
    sceneUpdate: function (time, delta)
    {
        var list = this._active;
        var length = list.length;

        for (var i = 0; i < length; i++)
        {
            var gameObject = list[i];

            if (gameObject.active)
            {
                gameObject.preUpdate.call(gameObject, time, delta);
            }
        }
    },

    /**
     * The Scene that owns this plugin is shutting down.
     *
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.GameObjects.UpdateList#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        var i = this._active.length;

        while (i--)
        {
            this._active[i].destroy(true);
        }

        i = this._pending.length;

        while (i--)
        {
            this._pending[i].destroy(true);
        }

        i = this._destroy.length;

        while (i--)
        {
            this._destroy[i].destroy(true);
        }

        this._toProcess = 0;

        this._pending = [];
        this._active = [];
        this._destroy = [];

        this.removeAllListeners();

        var eventEmitter = this.systems.events;

        eventEmitter.off(SceneEvents.PRE_UPDATE, this.update, this);
        eventEmitter.off(SceneEvents.UPDATE, this.sceneUpdate, this);
        eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     *
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.GameObjects.UpdateList#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.systems.events.off(SceneEvents.START, this.start, this);

        this.scene = null;
        this.systems = null;
    }

    /**
     * Adds a new item to the Update List.
     *
     * The item is added to the pending list and made active in the next update.
     *
     * @method Phaser.GameObjects.UpdateList#add
     * @since 3.0.0
     *
     * @param {*} item - The item to add to the queue.
     *
     * @return {*} The item that was added.
     */

    /**
     * Removes an item from the Update List.
     *
     * The item is added to the pending destroy and fully removed in the next update.
     *
     * @method Phaser.GameObjects.UpdateList#remove
     * @since 3.0.0
     *
     * @param {*} item - The item to be removed from the queue.
     *
     * @return {*} The item that was removed.
     */

    /**
     * Removes all active items from this Update List.
     *
     * All the items are marked as 'pending destroy' and fully removed in the next update.
     *
     * @method Phaser.GameObjects.UpdateList#removeAll
     * @since 3.20.0
     *
     * @return {this} This Update List object.
     */

    /**
     * Update this queue. First it will process any items awaiting destruction, and remove them.
     *
     * Then it will check to see if there are any items pending insertion, and move them to an
     * active state. Finally, it will return a list of active items for further processing.
     *
     * @method Phaser.GameObjects.UpdateList#update
     * @since 3.0.0
     *
     * @return {Array.<*>} A list of active items.
     */

    /**
     * Returns the current list of active items.
     *
     * This method returns a reference to the active list array, not a copy of it.
     * Therefore, be careful to not modify this array outside of the ProcessQueue.
     *
     * @method Phaser.GameObjects.UpdateList#getActive
     * @since 3.0.0
     *
     * @return {Array.<*>} A list of active items.
     */

    /**
     * The number of entries in the active list.
     *
     * @name Phaser.GameObjects.UpdateList#length
     * @type {number}
     * @readonly
     * @since 3.20.0
     */
});

PluginCache.register('UpdateList', UpdateList, 'updateList');

module.exports = UpdateList;
