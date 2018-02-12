/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var ArcadeImage = require('./ArcadeImage');
var ArcadeSprite = require('./ArcadeSprite');
var Class = require('../../utils/Class');
var CONST = require('./const');
var PhysicsGroup = require('./PhysicsGroup');
var StaticPhysicsGroup = require('./StaticPhysicsGroup');

/**
 * @classdesc
 * The Arcade Physics Factory allows you to easily create Arcade Physics enabled Game Objects.
 * Objects that are created by this Factory are automatically added to the physics world.
 *
 * @class Factory
 * @memberOf Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Arcade.World} world - The Arcade Physics World instance.
 */
var Factory = new Class({

    initialize:

    function Factory (world)
    {
        /**
         * A reference to the Arcade Physics World.
         *
         * @name Phaser.Physics.Arcade.Factory#world
         * @type {Phaser.Physics.Arcade.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * A reference to the Scene this Arcade Physics instance belongs to.
         *
         * @name Phaser.Physics.Arcade.Factory#scene
         * @type {Phaser.Scene}
         * @since 3.0.0
         */
        this.scene = world.scene;

        /**
         * A reference to the Scene.Systems this Arcade Physics instance belongs to.
         *
         * @name Phaser.Physics.Arcade.Factory#sys
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.sys = world.scene.sys;
    },

    /**
     * Create a new Arcade Physics Collider object.
     *
     * @method Phaser.Physics.Arcade.Factory#collider
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} object1 - The first object to check for collision.
     * @param {Phaser.Physics.Arcade.Body} object2 - The second object to check for collision.
     * @param {function} collideCallback - The callback to invoke when the two objects collide.
     * @param {function} processCallback - The callback to invoke when the two objects collide. Must return a boolean.
     * @param {object} callbackContext - The scope in which to call the callbacks.
     *
     * @return {Phaser.Physics.Arcade.Collider} The Collider that was created.
     */
    collider: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        return this.world.addCollider(object1, object2, collideCallback, processCallback, callbackContext);
    },

    /**
     * Create a new Arcade Physics Collider Overlap object.
     *
     * @method Phaser.Physics.Arcade.Factory#overlap
     * @since 3.0.0
     *
     * @param {Phaser.Physics.Arcade.Body} object1 - The first object to check for overlap.
     * @param {Phaser.Physics.Arcade.Body} object2 - The second object to check for overlap.
     * @param {function} collideCallback - The callback to invoke when the two objects collide.
     * @param {function} processCallback - The callback to invoke when the two objects collide. Must return a boolean.
     * @param {object} callbackContext - The scope in which to call the callbacks.
     *
     * @return {Phaser.Physics.Arcade.Collider} The Collider that was created.
     */
    overlap: function (object1, object2, collideCallback, processCallback, callbackContext)
    {
        return this.world.addOverlap(object1, object2, collideCallback, processCallback, callbackContext);
    },

    /**
     * Adds an Arcade Physics Body to the given Game Object.
     *
     * @method Phaser.Physics.Arcade.Factory#existing
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     * @param {boolean} [isStatic=false] - Set to true to create a Static body, otherwise it will create a Dynamic body.
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object.
     */
    existing: function (gameObject, isStatic)
    {
        var type = (isStatic) ? CONST.STATIC_BODY : CONST.DYNAMIC_BODY;

        this.world.enableBody(gameObject, type);

        return gameObject;
    },

    /**
     * Creates a new Arcade Image object with a Static body.
     *
     * @method Phaser.Physics.Arcade.Factory#staticImage
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.Physics.Arcade.Image} The Image object that was created.
     */
    staticImage: function (x, y, key, frame)
    {
        var image = new ArcadeImage(this.scene, x, y, key, frame);

        this.sys.displayList.add(image);

        this.world.enableBody(image, CONST.STATIC_BODY);

        return image;
    },

    /**
     * Creates a new Arcade Image object with a Dynamic body.
     *
     * @method Phaser.Physics.Arcade.Factory#image
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.Physics.Arcade.Image} The Image object that was created.
     */
    image: function (x, y, key, frame)
    {
        var image = new ArcadeImage(this.scene, x, y, key, frame);

        this.sys.displayList.add(image);

        this.world.enableBody(image, CONST.DYNAMIC_BODY);

        return image;
    },

    /**
     * Creates a new Arcade Sprite object with a Static body.
     *
     * @method Phaser.Physics.Arcade.Factory#staticSprite
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.Physics.Arcade.Sprite} The Sprite object that was created.
     */
    staticSprite: function (x, y, key, frame)
    {
        var sprite = new ArcadeSprite(this.scene, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        this.world.enableBody(sprite, CONST.STATIC_BODY);

        return sprite;
    },

    /**
     * Creates a new Arcade Sprite object with a Dynamic body.
     *
     * @method Phaser.Physics.Arcade.Factory#sprite
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {string|integer} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.Physics.Arcade.Sprite} The Sprite object that was created.
     */
    sprite: function (x, y, key, frame)
    {
        var sprite = new ArcadeSprite(this.scene, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        this.world.enableBody(sprite, CONST.DYNAMIC_BODY);

        return sprite;
    },

    /**
     * Creates a Static Physics Group object.
     * All Game Objects created by this Group will automatically be static Arcade Physics objects.
     *
     * @method Phaser.Physics.Arcade.Factory#staticGroup
     * @since 3.0.0
     *
     * @param {array} [children] - [description]
     * @param {object} [config] - [description]
     *
     * @return {Phaser.Physics.Arcade.StaticGroup} The Static Group object that was created.
     */
    staticGroup: function (children, config)
    {
        return this.sys.updateList.add(new StaticPhysicsGroup(this.world, this.world.scene, children, config));
    },

    /**
     * Creates a Physics Group object.
     * All Game Objects created by this Group will automatically be dynamic Arcade Physics objects.
     *
     * @method Phaser.Physics.Arcade.Factory#group
     * @since 3.0.0
     *
     * @param {array} [children] - [description]
     * @param {object} [config] - [description]
     *
     * @return {Phaser.Physics.Arcade.Group} The Group object that was created.
     */
    group: function (children, config)
    {
        return this.sys.updateList.add(new PhysicsGroup(this.world, this.world.scene, children, config));
    }

});

module.exports = Factory;
