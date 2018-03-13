/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var COLLIDES = require('../COLLIDES');

/**
 * [description]
 *
 * @name Phaser.Physics.Impact.Components.Collides
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
     * @param {[type]} callback - [description]
     * @param {[type]} scope - [description]
     *
     * @return {[type]} [description]
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
     * @return {[type]} [description]
     */
    setCollidesNever: function ()
    {
        this.body.collides = COLLIDES.NEVER;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setLite
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setLite: function ()
    {
        this.body.collides = COLLIDES.LITE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setPassive
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setPassive: function ()
    {
        this.body.collides = COLLIDES.PASSIVE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setActive
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setActive: function ()
    {
        this.body.collides = COLLIDES.ACTIVE;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Components.Collides#setFixed
     * @since 3.0.0
     *
     * @return {[type]} [description]
     */
    setFixed: function ()
    {
        this.body.collides = COLLIDES.FIXED;

        return this;
    },

    /**
     * [description]
     *
     * @name Phaser.Physics.Impact.Components.Collides#collides
     * @type {[type]}
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
