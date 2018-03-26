/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

//  Phaser.Physics.Arcade.StaticGroup

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Group = require('../../gameobjects/group/Group');

/**
 * @classdesc
 * [description]
 *
 * @class StaticGroup
 * @extends Phaser.GameObjects.Group
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - [description]
 * @param {Phaser.Scene} scene - [description]
 * @param {array} children - [description]
 * @param {GroupConfig} config - [description]
 */
var StaticPhysicsGroup = new Class({

    Extends: Group,

    initialize:

    function StaticPhysicsGroup (world, scene, children, config)
    {
        if (config === undefined && !Array.isArray(children) && typeof children === 'object')
        {
            config = children;
            children = null;
        }
        else if (config === undefined)
        {
            config = {};
        }

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticGroup#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        config.createCallback = this.createCallback;
        config.removeCallback = this.removeCallback;
        config.createMultipleCallback = this.createMultipleCallback;

        config.classType = ArcadeSprite;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticGroup#physicsType
         * @type {integer}
         * @since 3.0.0
         */
        this.physicsType = CONST.STATIC_BODY;

        Group.call(this, scene, children, config);
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticGroup#createCallback
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     */
    createCallback: function (child)
    {
        if (!child.body)
        {
            this.world.enableBody(child, CONST.STATIC_BODY);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticGroup#removeCallback
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     */
    removeCallback: function (child)
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticGroup#createMultipleCallback
     * @since 3.0.0
     *
     * @param {object} entries - [description]
     */
    createMultipleCallback: function ()
    {
        this.refresh();
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticGroup#refresh
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.StaticGroup} [description]
     */
    refresh: function ()
    {
        var children = this.children.entries;

        for (var i = 0; i < children.length; i++)
        {
            children[i].body.reset();
        }

        return this;
    }

});

module.exports = StaticPhysicsGroup;
