/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var List = require('../structs/List');
var PluginManager = require('../plugins/PluginManager');
var StableSort = require('../utils/array/StableSort');

var DisplayList = new Class({

    Extends: List,

    initialize:

    function DisplayList (scene)
    {
        List.call(this, scene);

        this.sortChildrenFlag = false;

        this.scene = scene;

        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }
    },

    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    //  Force a sort of the display list on the next call to process
    queueDepthSort: function ()
    {
        this.sortChildrenFlag = true;
    },

    //  Immediately sorts the display list if the flag is set
    depthSort: function ()
    {
        if (this.sortChildrenFlag)
        {
            StableSort.inplace(this.list, this.sortByDepth);

            this.sortChildrenFlag = false;
        }
    },

    sortByDepth: function (childA, childB)
    {
        return childA._depth - childB._depth;
    },

    //  Given an array of Game Objects, sort the array and return it,
    //  so that the objects are in index order with the lowest at the bottom.
    sortGameObjects: function (gameObjects)
    {
        if (gameObjects === undefined) { gameObjects = this.list; }

        this.scene.sys.depthSort();

        return gameObjects.sort(this.sortIndexHandler.bind(this));
    },

    //  Note that the given array is sorted in place, even though it isn't returned directly it will still be updated.
    getTopGameObject: function (gameObjects)
    {
        this.sortGameObjects(gameObjects);

        return gameObjects[gameObjects.length - 1];
    }

});

PluginManager.register('DisplayList', DisplayList, 'displayList');

module.exports = DisplayList;
