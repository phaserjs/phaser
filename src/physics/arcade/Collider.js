/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');

/**
 * @classdesc
 * [description]
 *
 * @class Collider
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - [description]
 * @param {boolean} overlapOnly - [description]
 * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object1 - The first object to check for collision.
 * @param {(Phaser.GameObjects.GameObject|Phaser.GameObjects.GameObject[])} object2 - The second object to check for collision.
 * @param {ArcadePhysicsCallback} collideCallback - The callback to invoke when the two objects collide.
 * @param {ArcadePhysicsCallback} processCallback - The callback to invoke when the two objects collide. Must return a boolean.
 * @param {object} callbackContext - The scope in which to call the callbacks.
 */
var Collider = new Class({

    initialize:

    function Collider (world, overlapOnly, object1, object2, collideCallback, processCallback, callbackContext)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#name
         * @type {string}
         * @since 3.1.0
         */
        this.name = '';

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#active
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.active = true;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#overlapOnly
         * @type {boolean}
         * @since 3.0.0
         */
        this.overlapOnly = overlapOnly;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#object1
         * @type {Phaser.Physics.Arcade.Body}
         * @since 3.0.0
         */
        this.object1 = object1;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#object2
         * @type {Phaser.Physics.Arcade.Body}
         * @since 3.0.0
         */
        this.object2 = object2;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#collideCallback
         * @type {ArcadePhysicsCallback}
         * @since 3.0.0
         */
        this.collideCallback = collideCallback;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#processCallback
         * @type {ArcadePhysicsCallback}
         * @since 3.0.0
         */
        this.processCallback = processCallback;

        /**
         * [description]
         *
         * @name Phaser.Physics.Arcade.Collider#callbackContext
         * @type {object}
         * @since 3.0.0
         */
        this.callbackContext = callbackContext;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Collider#setName
     * @since 3.1.0
     *
     * @param {string} name - [description]
     *
     * @return {Phaser.Physics.Arcade.Collider} [description]
     */
    setName: function (name)
    {
        this.name = name;

        return this;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Collider#update
     * @since 3.0.0
     */
    update: function ()
    {
        this.world.collideObjects(
            this.object1,
            this.object2,
            this.collideCallback,
            this.processCallback,
            this.callbackContext,
            this.overlapOnly
        );
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Arcade.Collider#destroy
     * @since 3.0.0
     */
    destroy: function ()
    {
        this.world.removeCollider(this);

        this.active = false;

        this.world = null;

        this.object1 = null;
        this.object2 = null;

        this.collideCallback = null;
        this.processCallback = null;
        this.callbackContext = null;
    }

});

module.exports = Collider;
