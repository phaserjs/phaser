/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var List = require('../structs/List');
var PluginCache = require('../plugins/PluginCache');
var StableSort = require('../utils/array/StableSort');

/**
 * @classdesc
 * The Display List plugin.
 *
 * Display Lists belong to a Scene and maintain the list of Game Objects to render every frame.
 *
 * Some of these Game Objects may also be part of the Scene's [Update List]{@link Phaser.GameObjects.UpdateList}, for updating.
 *
 * @class DisplayList
 * @extends Phaser.Structs.List.<Phaser.GameObjects.GameObject>
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene that this Display List belongs to.
 */
var DisplayList = new Class({

    Extends: List,

    initialize:

    function DisplayList (scene)
    {
        List.call(this, scene);

        /**
         * The flag the determines whether Game Objects should be sorted when `depthSort()` is called.
         *
         * @name Phaser.GameObjects.DisplayList#sortChildrenFlag
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.sortChildrenFlag = false;

        /**
         * The Scene that this Display List belongs to.
         *
         * @name Phaser.GameObjects.DisplayList#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * The Scene's Systems.
         *
         * @name Phaser.GameObjects.DisplayList#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        scene.sys.events.once('boot', this.boot, this);
        scene.sys.events.on('start', this.start, this);
    },

    /**
     * This method is called automatically, only once, when the Scene is first created.
     * Do not invoke it directly.
     *
     * @method Phaser.GameObjects.DisplayList#boot
     * @private
     * @since 3.5.1
     */
    boot: function ()
    {
        this.systems.events.once('destroy', this.destroy, this);
    },

    /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.
     *
     * @method Phaser.GameObjects.DisplayList#start
     * @private
     * @since 3.5.0
     */
    start: function ()
    {
        this.systems.events.once('shutdown', this.shutdown, this);
    },

    /**
     * Force a sort of the display list on the next call to depthSort.
     *
     * @method Phaser.GameObjects.DisplayList#queueDepthSort
     * @since 3.0.0
     */
    queueDepthSort: function ()
    {
        this.sortChildrenFlag = true;
    },

    /**
     * Immediately sorts the display list if the flag is set.
     *
     * @method Phaser.GameObjects.DisplayList#depthSort
     * @since 3.0.0
     */
    depthSort: function ()
    {
        if (this.sortChildrenFlag)
        {
            StableSort.inplace(this.list, this.sortByDepth);

            this.sortChildrenFlag = false;
        }
    },

    /**
     * Compare the depth of two Game Objects.
     *
     * @method Phaser.GameObjects.DisplayList#sortByDepth
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} childA - The first Game Object.
     * @param {Phaser.GameObjects.GameObject} childB - The second Game Object.
     *
     * @return {integer} The difference between the depths of each Game Object.
     */
    sortByDepth: function (childA, childB)
    {
        return childA._depth - childB._depth;
    },

    /**
     * Given an array of Game Objects, sort the array and return it, so that
     * the objects are in index order with the lowest at the bottom.
     *
     * @method Phaser.GameObjects.DisplayList#sortGameObjects
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} gameObjects - The array of Game Objects to sort.
     *
     * @return {array} The sorted array of Game Objects.
     */
    sortGameObjects: function (gameObjects)
    {
        if (gameObjects === undefined) { gameObjects = this.list; }

        this.scene.sys.depthSort();

        return gameObjects.sort(this.sortIndexHandler.bind(this));
    },

    /**
     * Get the top-most Game Object in the given array of Game Objects, after sorting it.
     *
     * Note that the given array is sorted in place, even though it isn't returned directly it will still be updated.
     *
     * @method Phaser.GameObjects.DisplayList#getTopGameObject
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} gameObjects - The array of Game Objects.
     *
     * @return {Phaser.GameObjects.GameObject} The top-most Game Object in the array of Game Objects.
     */
    getTopGameObject: function (gameObjects)
    {
        this.sortGameObjects(gameObjects);

        return gameObjects[gameObjects.length - 1];
    },

    /**
     * The Scene that owns this plugin is shutting down.
     * We need to kill and reset all internal properties as well as stop listening to Scene events.
     *
     * @method Phaser.GameObjects.DisplayList#shutdown
     * @private
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAll();

        this.systems.events.off('shutdown', this.shutdown, this);
    },

    /**
     * The Scene that owns this plugin is being destroyed.
     * We need to shutdown and then kill off all external references.
     *
     * @method Phaser.GameObjects.DisplayList#destroy
     * @private
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene.sys.events.off('start', this.start, this);

        this.scene = null;
        this.systems = null;
    }

});

PluginCache.register('DisplayList', DisplayList, 'displayList');

module.exports = DisplayList;
