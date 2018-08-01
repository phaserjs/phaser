/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Group = require('../../gameobjects/group/Group');
var IsPlainObject = require('../../utils/object/IsPlainObject');

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
        if (!children && !config)
        {
            config = {
                createCallback: this.createCallbackHandler,
                removeCallback: this.removeCallbackHandler,
                createMultipleCallback: this.createMultipleCallbackHandler,
                classType: ArcadeSprite
            };
        }
        else if (IsPlainObject(children))
        {
            //  children is a plain object, so swizzle them:
            config = children;
            children = null;

            config.createCallback = this.createCallbackHandler;
            config.removeCallback = this.removeCallbackHandler;
            config.createMultipleCallback = this.createMultipleCallbackHandler;
            config.classType = ArcadeSprite;
        }
        else if (Array.isArray(children) && IsPlainObject(children[0]))
        {
            //  children is an array of plain objects
            config = children;
            children = null;

            config.forEach(function (singleConfig)
            {
                singleConfig.createCallback = this.createCallbackHandler;
                singleConfig.removeCallback = this.removeCallbackHandler;
                singleConfig.createMultipleCallback = this.createMultipleCallbackHandler;
                singleConfig.classType = ArcadeSprite;
            });
        }

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.StaticGroup#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

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
     * @method Phaser.Physics.Arcade.StaticGroup#createCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     */
    createCallbackHandler: function (child)
    {
        if (!child.body)
        {
            this.world.enableBody(child, CONST.STATIC_BODY);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticGroup#removeCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     */
    removeCallbackHandler: function (child)
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.StaticGroup#createMultipleCallbackHandler
     * @since 3.0.0
     *
     * @param {object} entries - [description]
     */
    createMultipleCallbackHandler: function ()
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
