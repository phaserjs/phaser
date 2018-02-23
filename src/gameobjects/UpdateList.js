/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../utils/Class');
var PluginManager = require('../boot/PluginManager');

/**
 * @classdesc
 * [description]
 *
 * @class UpdateList
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - [description]
 */
var UpdateList = new Class({

    initialize:

    function UpdateList (scene)
    {
        /**
         * [description]
         *
         * @name Phaser.GameObjects.UpdateList#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = scene;

        /**
         * [description]
         *
         * @name Phaser.GameObjects.UpdateList#systems
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.systems = scene.sys;

        if (!scene.sys.settings.isBooted)
        {
            scene.sys.events.once('boot', this.boot, this);
        }

        /**
         * [description]
         *
         * @name Phaser.GameObjects.UpdateList#_list
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._list = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.UpdateList#_pendingInsertion
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingInsertion = [];

        /**
         * [description]
         *
         * @name Phaser.GameObjects.UpdateList#_pendingRemoval
         * @type {array}
         * @private
         * @default []
         * @since 3.0.0
         */
        this._pendingRemoval = [];
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#boot
     * @since 3.0.0
     */
    boot: function ()
    {
        var eventEmitter = this.systems.events;

        eventEmitter.on('preupdate', this.preUpdate, this);
        eventEmitter.on('update', this.update, this);
        eventEmitter.on('shutdown', this.shutdown, this);
        eventEmitter.on('destroy', this.destroy, this);
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#add
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#preUpdate
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#update
     * @since 3.0.0
     *
     * @param {number} time - [description]
     * @param {number} delta - [description]
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
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#remove
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     *
     * @return {Phaser.GameObjects.GameObject} [description]
     */
    remove: function (child)
    {
        var index = this._list.indexOf(child);

        if (index !== -1)
        {
            this._list.splice(index, 1);
        }
        
        return child;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#removeAll
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.UpdateList} The UpdateList object.
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
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#shutdown
     * @since 3.0.0
     */
    shutdown: function ()
    {
        this.removeAll();

        this._list.length = 0;
        this._pendingRemoval.length = 0;
        this._pendingInsertion.length = 0;
    },

    /**
     * [description]
     *
     * @method Phaser.GameObjects.UpdateList#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.shutdown();

        this.scene = undefined;
        this.systems = undefined;

    }

});

PluginManager.register('UpdateList', UpdateList, 'updateList');

module.exports = UpdateList;
