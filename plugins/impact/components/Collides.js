/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var COLLIDES = require('../COLLIDES');

/**
 * @callback CollideCallback
 *
 * @param {Phaser.Physics.Impact.Body} body - [description]
 * @param {Phaser.Physics.Impact.Body} other - [description]
 * @param {string} axis - [description]
 */

/**
 * The Impact Collides component.
 * Should be applied as a mixin.
 *
 * @namespace Phaser.Physics.Impact.Components.Collides
 * @since 3.0.0
 */
var Collides = {

    _collideCallback: null,
    _callbackScope: null,

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setCollideCallback
     * @since 3.0.0
     *
     * @param {CollideCallback} callback - [description]
     * @param {*} scope - [description]
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollideCallback: function (callback, scope)
    {
        this._collideCallback = callback;

        if (scope)
        {
            this._callbackScope = scope;
        }

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setCollidesNever
     * @since 3.0.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setCollidesNever: function ()
    {
        this.body.collides = COLLIDES.NEVER;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setLiteCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setLiteCollision: function ()
    {
        this.body.collides = COLLIDES.LITE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setPassiveCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setPassiveCollision: function ()
    {
        this.body.collides = COLLIDES.PASSIVE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setActiveCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setActiveCollision: function ()
    {
        this.body.collides = COLLIDES.ACTIVE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setFixedCollision
     * @since 3.6.0
     *
     * @return {Phaser.GameObjects.GameObject} This Game Object.
     */
    setFixedCollision: function ()
    {
        this.body.collides = COLLIDES.FIXED;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Collides#collides
     * @type {number}
     * @since 3.0.0
     */
    collides: {

        get: function ()
        {
            return this.body.collides;
        },

        set: function (value)
        {
            this.body.collides = value;
        }

    }

};

module.exports = Collides;
