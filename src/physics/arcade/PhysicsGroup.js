/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var GetFastValue = require('../../utils/object/GetFastValue');
var Group = require('../../gameobjects/group/Group');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @classdesc
 * An Arcade Physics Group object.
 *
 * All Game Objects created by this Group will automatically be given dynamic Arcade Physics bodies.
 *
 * Its static counterpart is {@link Phaser.Physics.Arcade.StaticGroup}.
 *
 * @class Group
 * @extends Phaser.GameObjects.Group
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The physics simulation.
 * @param {Phaser.Scene} scene - The scene this group belongs to.
 * @param {(Phaser.GameObjects.GameObject[]|Phaser.Types.Physics.Arcade.PhysicsGroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig)} [children] - Game Objects to add to this group; or the `config` argument.
 * @param {Phaser.Types.Physics.Arcade.PhysicsGroupConfig|Phaser.Types.GameObjects.Group.GroupCreateConfig} [config] - Settings for this group.
 */
var PhysicsGroup = new Class({

    Extends: Group,

    initialize:

    function PhysicsGroup (world, scene, children, config)
    {
        if (!children && !config)
        {
            config = {
                createCallback: this.createCallbackHandler,
                removeCallback: this.removeCallbackHandler
            };
        }
        else if (IsPlainObject(children))
        {
            //  children is a plain object, so swizzle them:
            config = children;
            children = null;

            config.createCallback = this.createCallbackHandler;
            config.removeCallback = this.removeCallbackHandler;
        }
        else if (Array.isArray(children) && IsPlainObject(children[0]))
        {
            //  children is an array of plain objects
            config = children[0];

            var _this = this;

            children.forEach(function (singleConfig)
            {
                singleConfig.createCallback = _this.createCallbackHandler;
                singleConfig.removeCallback = _this.removeCallbackHandler;
            });
        }
        else
        {
            // config is not defined and children is not a plain object nor an array of plain objects
            config = {
                createCallback: this.createCallbackHandler,
                removeCallback: this.removeCallbackHandler
            };
        }

        /**
         * The physics simulation.
         *
         * @name Phaser.Physics.Arcade.Group#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * The class to create new Group members from.
         * 
         * This should be either `Phaser.Physics.Arcade.Image`, `Phaser.Physics.Arcade.Sprite`, or a class extending one of those.
         *
         * @name Phaser.Physics.Arcade.Group#classType
         * @type {Phaser.Types.GameObjects.Group.GroupClassType}
         * @default ArcadeSprite
         * @since 3.0.0
         */
        config.classType = GetFastValue(config, 'classType', ArcadeSprite);

        /**
         * The physics type of the Group's members.
         *
         * @name Phaser.Physics.Arcade.Group#physicsType
         * @type {integer}
         * @default Phaser.Physics.Arcade.DYNAMIC_BODY
         * @since 3.0.0
         */
        this.physicsType = CONST.DYNAMIC_BODY;

        /**
         * Default physics properties applied to Game Objects added to the Group or created by the Group. Derived from the `config` argument.
         *
         * @name Phaser.Physics.Arcade.Group#defaults
         * @type {Phaser.Types.Physics.Arcade.PhysicsGroupDefaults}
         * @since 3.0.0
         */
        this.defaults = {
            setCollideWorldBounds: GetFastValue(config, 'collideWorldBounds', false),
            setAccelerationX: GetFastValue(config, 'accelerationX', 0),
            setAccelerationY: GetFastValue(config, 'accelerationY', 0),
            setAllowDrag: GetFastValue(config, 'allowDrag', true),
            setAllowGravity: GetFastValue(config, 'allowGravity', true),
            setAllowRotation: GetFastValue(config, 'allowRotation', true),
            setBounceX: GetFastValue(config, 'bounceX', 0),
            setBounceY: GetFastValue(config, 'bounceY', 0),
            setDragX: GetFastValue(config, 'dragX', 0),
            setDragY: GetFastValue(config, 'dragY', 0),
            setEnable: GetFastValue(config, 'enable', true),
            setGravityX: GetFastValue(config, 'gravityX', 0),
            setGravityY: GetFastValue(config, 'gravityY', 0),
            setFrictionX: GetFastValue(config, 'frictionX', 0),
            setFrictionY: GetFastValue(config, 'frictionY', 0),
            setVelocityX: GetFastValue(config, 'velocityX', 0),
            setVelocityY: GetFastValue(config, 'velocityY', 0),
            setAngularVelocity: GetFastValue(config, 'angularVelocity', 0),
            setAngularAcceleration: GetFastValue(config, 'angularAcceleration', 0),
            setAngularDrag: GetFastValue(config, 'angularDrag', 0),
            setMass: GetFastValue(config, 'mass', 1),
            setImmovable: GetFastValue(config, 'immovable', false)
        };

        if (Array.isArray(children))
        {
            config = null;
        }

        Group.call(this, scene, children, config);
    },

    /**
     * Enables a Game Object's Body and assigns `defaults`. Called when a Group member is added or created.
     *
     * @method Phaser.Physics.Arcade.Group#createCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object being added.
     */
    createCallbackHandler: function (child)
    {
        if (!child.body)
        {
            this.world.enableBody(child, CONST.DYNAMIC_BODY);
        }

        var body = child.body;

        for (var key in this.defaults)
        {
            body[key](this.defaults[key]);
        }
    },

    /**
     * Disables a Game Object's Body. Called when a Group member is removed.
     *
     * @method Phaser.Physics.Arcade.Group#removeCallbackHandler
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - The Game Object being removed.
     */
    removeCallbackHandler: function (child)
    {
        if (child.body)
        {
            this.world.disableBody(child);
        }
    },

    /**
     * Sets the velocity of each Group member.
     *
     * @method Phaser.Physics.Arcade.Group#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - The horizontal velocity.
     * @param {number} y - The vertical velocity.
     * @param {number} [step=0] - The velocity increment. When set, the first member receives velocity (x, y), the second (x + step, y + step), and so on.
     *
     * @return {Phaser.Physics.Arcade.Group} This Physics Group object.
     */
    setVelocity: function (x, y, step)
    {
        if (step === undefined) { step = 0; }

        var items = this.getChildren();

        for (var i = 0; i < items.length; i++)
        {
            items[i].body.velocity.set(x + (i * step), y + (i * step));
        }

        return this;
    },

    /**
     * Sets the horizontal velocity of each Group member.
     *
     * @method Phaser.Physics.Arcade.Group#setVelocityX
     * @since 3.0.0
     *
     * @param {number} value - The velocity value.
     * @param {number} [step=0] - The velocity increment. When set, the first member receives velocity (x), the second (x + step), and so on.
     *
     * @return {Phaser.Physics.Arcade.Group} This Physics Group object.
     */
    setVelocityX: function (value, step)
    {
        if (step === undefined) { step = 0; }

        var items = this.getChildren();

        for (var i = 0; i < items.length; i++)
        {
            items[i].body.velocity.x = value + (i * step);
        }

        return this;
    },

    /**
     * Sets the vertical velocity of each Group member.
     *
     * @method Phaser.Physics.Arcade.Group#setVelocityY
     * @since 3.0.0
     *
     * @param {number} value - The velocity value.
     * @param {number} [step=0] - The velocity increment. When set, the first member receives velocity (y), the second (y + step), and so on.
     *
     * @return {Phaser.Physics.Arcade.Group} This Physics Group object.
     */
    setVelocityY: function (value, step)
    {
        if (step === undefined) { step = 0; }

        var items = this.getChildren();

        for (var i = 0; i < items.length; i++)
        {
            items[i].body.velocity.y = value + (i * step);
        }

        return this;
    }

});

module.exports = PhysicsGroup;
