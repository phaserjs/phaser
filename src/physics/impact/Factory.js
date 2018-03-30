/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var ImpactBody = require('./ImpactBody');
var ImpactImage = require('./ImpactImage');
var ImpactSprite = require('./ImpactSprite');

/**
 * @classdesc
 * The Impact Physics Factory allows you to easily create Impact Physics enabled Game Objects.
 * Objects that are created by this Factory are automatically added to the physics world.
 *
 * @class Factory
 * @memberOf Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 */
var Factory = new Class({

    initialize:

    function Factory (world)
    {
        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.Factory#world
         * @type {Phaser.Physics.Impact.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * A reference to the Scene.Systems this Impact Physics instance belongs to.
         *
         * @name Phaser.Physics.Impact.Factory#sys
         * @type {Phaser.Scenes.Systems}
         * @since 3.0.0
         */
        this.sys = world.scene.sys;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Factory#body
     * @since 3.0.0
     *
     * @param {number} x - [description]
     * @param {number} y - [description]
     * @param {number} width - [description]
     * @param {number} height - [description]
     *
     * @return {Phaser.Physics.Impact.ImpactBody} The ImpactBody object that was created.
     */
    body: function (x, y, width, height)
    {
        return new ImpactBody(this.world, x, y, width, height);
    },

    /**
     * Adds an Impact Physics Body to the given Game Object.
     *
     * @method Phaser.Physics.Impact.Factory#existing
     * @since 3.0.0
     *
     * @param {Phaser.GameObjects.GameObject} gameObject - [description]
     *
     * @return {Phaser.GameObjects.GameObject} The Game Object.
     */
    existing: function (gameObject)
    {
        var x = gameObject.x - gameObject.frame.centerX;
        var y = gameObject.y - gameObject.frame.centerY;
        var w = gameObject.width;
        var h = gameObject.height;

        gameObject.body = this.world.create(x, y, w, h);

        gameObject.body.parent = gameObject;
        gameObject.body.gameObject = gameObject;

        return gameObject;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Factory#image
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.Physics.Impact.ImpactImage} The ImpactImage object that was created.
     */
    image: function (x, y, key, frame)
    {
        var image = new ImpactImage(this.world, x, y, key, frame);

        this.sys.displayList.add(image);

        return image;
    },

    /**
     * [description]
     *
     * @method Phaser.Physics.Impact.Factory#sprite
     * @since 3.0.0
     *
     * @param {number} x - The horizontal position of this Game Object in the world.
     * @param {number} y - The vertical position of this Game Object in the world.
     * @param {string} key - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
     * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
     *
     * @return {Phaser.Physics.Impact.ImpactSprite} The ImpactSprite object that was created.
     */
    sprite: function (x, y, key, frame)
    {
        var sprite = new ImpactSprite(this.world, x, y, key, frame);

        this.sys.displayList.add(sprite);
        this.sys.updateList.add(sprite);

        return sprite;
    }

});

module.exports = Factory;
