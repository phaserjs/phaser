/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var List = require('../structs/List');
var PluginManager = require('../boot/PluginManager');
var StableSort = require('../utils/array/StableSort');

/**
 * @classdesc
 * [description]
 *
 * @class DisplayList
 * @extends Phaser.Structs.List
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var DisplayList = new Class({

    Extends: List,

    initialize:

    function DisplayList (scene)
    {
        List.call(this, scene);

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DisplayList#sortChildrenFlag
         * @type {boolean}
         * @default false
         * @since 3.0.0
         */
        this.sortChildrenFlag = false;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DisplayList#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.DisplayList#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.DisplayList#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
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
     * [description]
     *
     * @method Phaser.GameObjects.DisplayList#sortByDepth
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} childA - [description]
     * @param {Phaser.GameObjects.GameObject} childB - [description]
     *
     * @return {integer} [description]
     */
    sortByDepth: function (childA, childB)
    {
        return childA._depth - childB._depth;
    },

    /**
     * Given an array of Game Objects, sort the array and return it,
     * so that the objects are in index order with the lowest at the bottom.
     *
     * @method Phaser.GameObjects.DisplayList#sortGameObjects
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} gameObjects - [description]
     *
     * @return {array} [description]
     */
    sortGameObjects: function (gameObjects)
    {
        if (gameObjects === undefined) { gameObjects = this.list; }

        this.scene.sys.depthSort();

        return gameObjects.sort(this.sortIndexHandler.bind(this));
    },

    /**
     * Note that the given array is sorted in place, even though it isn't returned directly it will still be updated.
     *
     * @method Phaser.GameObjects.DisplayList#getTopGameObject
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} gameObjects - [description]
     *
     * @return {Phaser.GameObjects.GameObject} The top-most Game Object on the Display List.
     */
    getTopGameObject: function (gameObjects)
    {
        this.sortGameObjects(gameObjects);

        return gameObjects[gameObjects.length - 1];
    }

});

PluginManager.register('DisplayList', DisplayList, 'displayList');

module.exports = DisplayList;
