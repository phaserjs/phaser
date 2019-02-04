/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var GetFastValue = require('../../utils/object/GetFastValue');
var Group = require('../../gameobjects/group/Group');
var IsPlainObject = require('../../utils/object/IsPlainObject');

/**
 * @typedef {object} PhysicsGroupConfig
 * @extends GroupConfig
 *
 * @property {boolean} [collideWorldBounds=false] - Sets {@link Phaser.Physics.Arcade.Body#collideWorldBounds}.
 * @property {number} [accelerationX=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.x}.
 * @property {number} [accelerationY=0] - Sets {@link Phaser.Physics.Arcade.Body#acceleration acceleration.y}.
 * @property {boolean} [allowDrag=true] - Sets {@link Phaser.Physics.Arcade.Body#allowDrag}.
 * @property {boolean} [allowGravity=true] - Sets {@link Phaser.Physics.Arcade.Body#allowGravity}.
 * @property {boolean} [allowRotation=true] - Sets {@link Phaser.Physics.Arcade.Body#allowRotation}.
 * @property {number} [bounceX=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.x}.
 * @property {number} [bounceY=0] - Sets {@link Phaser.Physics.Arcade.Body#bounce bounce.y}.
 * @property {number} [dragX=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.x}.
 * @property {number} [dragY=0] - Sets {@link Phaser.Physics.Arcade.Body#drag drag.y}.
 * @property {boolean} [enable=true] - Sets {@link Phaser.Physics.Arcade.Body#enable enable}.
 * @property {number} [gravityX=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.x}.
 * @property {number} [gravityY=0] - Sets {@link Phaser.Physics.Arcade.Body#gravity gravity.y}.
 * @property {number} [frictionX=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.x}.
 * @property {number} [frictionY=0] - Sets {@link Phaser.Physics.Arcade.Body#friction friction.y}.
 * @property {number} [velocityX=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.x}.
 * @property {number} [velocityY=0] - Sets {@link Phaser.Physics.Arcade.Body#velocity velocity.y}.
 * @property {number} [angularVelocity=0] - Sets {@link Phaser.Physics.Arcade.Body#angularVelocity}.
 * @property {number} [angularAcceleration=0] - Sets {@link Phaser.Physics.Arcade.Body#angularAcceleration}.
 * @property {number} [angularDrag=0] - Sets {@link Phaser.Physics.Arcade.Body#angularDrag}.
 * @property {number} [mass=0] - Sets {@link Phaser.Physics.Arcade.Body#mass}.
 * @property {boolean} [immovable=false] - Sets {@link Phaser.Physics.Arcade.Body#immovable}.
 */

/**
 * @typedef {object} PhysicsGroupDefaults
 *
 * @property {boolean} setCollideWorldBounds - As {@link Phaser.Physics.Arcade.Body#setCollideWorldBounds}.
 * @property {number} setAccelerationX - As {@link Phaser.Physics.Arcade.Body#setAccelerationX}.
 * @property {number} setAccelerationY - As {@link Phaser.Physics.Arcade.Body#setAccelerationY}.
 * @property {boolean} setAllowDrag - As {@link Phaser.Physics.Arcade.Body#setAllowDrag}.
 * @property {boolean} setAllowGravity - As {@link Phaser.Physics.Arcade.Body#setAllowGravity}.
 * @property {boolean} setAllowRotation - As {@link Phaser.Physics.Arcade.Body#setAllowRotation}.
 * @property {number} setBounceX - As {@link Phaser.Physics.Arcade.Body#setBounceX}.
 * @property {number} setBounceY - As {@link Phaser.Physics.Arcade.Body#setBounceY}.
 * @property {number} setDragX - As {@link Phaser.Physics.Arcade.Body#setDragX}.
 * @property {number} setDragY - As {@link Phaser.Physics.Arcade.Body#setDragY}.
 * @property {boolean} setEnable - As {@link Phaser.Physics.Arcade.Body#setEnable}.
 * @property {number} setGravityX - As {@link Phaser.Physics.Arcade.Body#setGravityX}.
 * @property {number} setGravityY - As {@link Phaser.Physics.Arcade.Body#setGravityY}.
 * @property {number} setFrictionX - As {@link Phaser.Physics.Arcade.Body#setFrictionX}.
 * @property {number} setFrictionY - As {@link Phaser.Physics.Arcade.Body#setFrictionY}.
 * @property {number} setVelocityX - As {@link Phaser.Physics.Arcade.Body#setVelocityX}.
 * @property {number} setVelocityY - As {@link Phaser.Physics.Arcade.Body#setVelocityY}.
 * @property {number} setAngularVelocity - As {@link Phaser.Physics.Arcade.Body#setAngularVelocity}.
 * @property {number} setAngularAcceleration - As {@link Phaser.Physics.Arcade.Body#setAngularAcceleration}.
 * @property {number} setAngularDrag - As {@link Phaser.Physics.Arcade.Body#setAngularDrag}.
 * @property {number} setMass - As {@link Phaser.Physics.Arcade.Body#setMass}.
 * @property {boolean} setImmovable - As {@link Phaser.Physics.Arcade.Body#setImmovable}.
 */

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
 * @param {(Phaser.GameObjects.GameObject[]|PhysicsGroupConfig|GroupCreateConfig)} [children] - Game Objects to add to this group; or the `config` argument.
 * @param {PhysicsGroupConfig|GroupCreateConfig} [config] - Settings for this group.
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
            config = children;
            children = null;

            config.forEach(function (singleConfig)
            {
                singleConfig.createCallback = this.createCallbackHandler;
                singleConfig.removeCallback = this.removeCallbackHandler;
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
         * @type {GroupClassTypeConstructor}
         * @default ArcadeSprite
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
         * @type {PhysicsGroupDefaults}
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
