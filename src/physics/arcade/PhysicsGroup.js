/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var GetFastValue = require('../../utils/object/GetFastValue');
var Group = require('../../gameobjects/group/Group');

/**
 * @typedef {object} PhysicsGroupConfig
 * @extends GroupConfig
 *
 * @property {[type]} [collideWorldBounds=false] - [description]
 * @property {number} [accelerationX=0] - [description]
 * @property {number} [accelerationY=0] - [description]
 * @property {number} [bounceX=0] - [description]
 * @property {number} [bounceY=0] - [description]
 * @property {number} [dragX=0] - [description]
 * @property {number} [dragY=0] - [description]
 * @property {number} [gravityX=0] - [description]
 * @property {number} [gravityY=0] - [description]
 * @property {number} [frictionX=0] - [description]
 * @property {number} [frictionY=0] - [description]
 * @property {number} [velocityX=0] - [description]
 * @property {number} [velocityY=0] - [description]
 * @property {number} [angularVelocity=0] - [description]
 * @property {number} [angularAcceleration=0] - [description]
 * @property {number} [angularDrag=0] - [description]
 * @property {number} [mass=0] - [description]
 * @property {boolean} [immovable=false] - [description]
 */

/**
 * @typedef {object} PhysicsGroupDefaults
 *
 * @property {[type]} setCollideWorldBounds - [description]
 * @property {number} setAccelerationX - [description]
 * @property {number} setAccelerationY - [description]
 * @property {number} setBounceX - [description]
 * @property {number} setBounceY - [description]
 * @property {number} setDragX - [description]
 * @property {number} setDragY - [description]
 * @property {number} setGravityX - [description]
 * @property {number} setGravityY - [description]
 * @property {number} setFrictionX - [description]
 * @property {number} setFrictionY - [description]
 * @property {number} setVelocityX - [description]
 * @property {number} setVelocityY - [description]
 * @property {number} setAngularVelocity - [description]
 * @property {number} setAngularAcceleration - [description]
 * @property {number} setAngularDrag - [description]
 * @property {number} setMass - [description]
 * @property {boolean} setImmovable - [description]
 */

/**
 * @classdesc
 * An Arcade Physics Group object.
 *
 * All Game Objects created by this Group will automatically be dynamic Arcade Physics objects.
 *
 * @class Group
 * @extends Phaser.GameObjects.Group
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - [description]
 * @param {Phaser.Scene} scene - [description]
 * @param {array} children - [description]
 * @param {PhysicsGroupConfig} [config] - [description]
 */
var PhysicsGroup = new Class({

    Extends: Group,

    initialize:

    function PhysicsGroup (world, scene, children, config)
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
         * @name Phaser.Physics.Arcade.Group#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        config.createCallback = this.createCallback;
        config.removeCallback = this.removeCallback;

        config.classType = GetFastValue(config, 'classType', ArcadeSprite);

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Group#physicsType
         * @type {integer}
         * @since 3.0.0
         */
        this.physicsType = CONST.DYNAMIC_BODY;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Group#defaults
         * @type {PhysicsGroupDefaults}
         * @since 3.0.0
         */
        this.defaults = {
            setCollideWorldBounds: GetFastValue(config, 'collideWorldBounds', false),
            setAccelerationX: GetFastValue(config, 'accelerationX', 0),
            setAccelerationY: GetFastValue(config, 'accelerationY', 0),
            setBounceX: GetFastValue(config, 'bounceX', 0),
            setBounceY: GetFastValue(config, 'bounceY', 0),
            setDragX: GetFastValue(config, 'dragX', 0),
            setDragY: GetFastValue(config, 'dragY', 0),
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Group#createCallback
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} child - [description]
     */
    createCallback: function (child)
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Group#removeCallback
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
     * @method Phaser.Physics.Arcade.Group#setVelocity
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} step - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Group#setVelocityX
     * @since 3.0.0
     *
     * @param {number} value - [description]
     * @param {number} step - [description]
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
     * [description]
     *
     * @method Phaser.Physics.Arcade.Group#setVelocityY
     * @since 3.0.0
     *
     * @param {number} value - [description]
     * @param {number} step - [description]
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
