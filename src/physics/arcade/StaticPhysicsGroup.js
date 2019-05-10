/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var Group = require('../../gameobjects/group/Group');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * An Arcade Physics Static Group object.
 *
 * All Game Objects created by this Group will automatically be given static Arcade Physics bodies.
 *
 * Its dynamic counterpart is {@link Phaser.Physics.Arcade.Group}.
 *
 * @class StaticGroup
 * @extends Phaser.GameObjects.Group
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The physics simulation.
 * @param {Phaser.Scene} scene - The scene this group belongs to.
 * @param {(Phaser.GameObjects.GameObject[]|Phaser.Types.GameObjects.Group.GroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig)} [children] - Game Objects to add to this group; or the `config` argument.
 * @param {Phaser.Types.GameObjects.Group.GroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig} [config] - Settings for this group.
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
         * The physics simulation.
         *
         * @name Phaser.Physics.Arcade.StaticGroup#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * The scene this group belongs to.
         *
         * @name Phaser.Physics.Arcade.StaticGroup#physicsType
         * @type {integer}
         * @default Phaser.Physics.Arcade.STATIC_BODY
         * @since 3.0.0
         */
        this.physicsType = CONST.STATIC_BODY;

        Group.call(this, scene, children, config);
    },

    /**
     * Adds a static physics body to the new group member (if it lacks one) and adds it to the simulation.
     *
     * @method Phaser.Physics.Arcade.StaticGroup#createCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The new group member.
     *
     * @see Phaser.Physics.Arcade.World#enableBody
     */
    createCallbackHandler: function (child)
    {
        if (!child.body)
        {
            this.world.enableBody(child, CONST.STATIC_BODY);
        }
    },

    /**
     * Disables the group member's physics body, removing it from the simulation.
     *
     * @method Phaser.Physics.Arcade.StaticGroup#removeCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The group member being removed.
     *
     * @see Phaser.Physics.Arcade.World#disableBody
     */
    removeCallbackHandler: function (child)
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    },

    /**
     * Refreshes the group.
     *
     * @method Phaser.Physics.Arcade.StaticGroup#createMultipleCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject[]} entries - The newly created group members.
     *
     * @see Phaser.Physics.Arcade.StaticGroup#refresh
     */
    createMultipleCallbackHandler: function ()
    {
        this.refresh();
    },

    /**
     * Resets each Body to the position of its parent Game Object.
     * Body sizes aren't changed (use {@link Phaser.Physics.Arcade.Components.Enable#refreshBody} for that).
     *
     * @method Phaser.Physics.Arcade.StaticGroup#refresh
     * @since 3.0.0
     *
     * @return {Phaser.Physics.Arcade.StaticGroup} This group.
     *
     * @see Phaser.Physics.Arcade.StaticBody#reset
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
