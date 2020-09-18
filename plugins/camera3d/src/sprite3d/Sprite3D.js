/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../../../src/utils/Class');
var GameObject = require('../../../../src/gameobjects/GameObject');
var Sprite = require('../../../../src/gameobjects/sprite/Sprite');
var Vector2 = require('../../../../src/math/Vector2');
var Vector4 = require('../../../../src/math/Vector4');

/**
 * @classdesc
 * A Sprite 3D Game Object.
 *
 * The Sprite 3D object is an encapsulation of a standard Sprite object, with additional methods to allow
 * it to be rendered by a 3D Camera. The Sprite can be positioned anywhere within 3D space.
 *
 * @class Sprite3D
 * @extends Phaser.GameObjects.Sprite
 * @memberOf Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The x position of this Game Object.
 * @param {number} y - The y position of this Game Object.
 * @param {number} z - The z position of this Game Object.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Sprite3D = new Class({

    Extends: GameObject,

    initialize:

    function Sprite3D (scene, x, y, z, texture, frame)
    {
        GameObject.call(this, scene, 'Sprite3D');

        /**
         * The encapsulated Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#gameObject
         * @type {Phaser.GameObjects.GameObject}
         * @since 3.0.0
         */
        this.gameObject = new Sprite(scene, 0, 0, texture, frame);

        /**
         * The position of the Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#position
         * @type {Phaser.Math.Vector4}
         * @since 3.0.0
         */
        this.position = new Vector4(x, y, z);

        /**
         * The 2D size of the Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#size
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.size = new Vector2(this.gameObject.width, this.gameObject.height);

        /**
         * The 2D scale of the Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#scale
         * @type {Phaser.Math.Vector2}
         * @since 3.0.0
         */
        this.scale = new Vector2(1, 1);

        /**
         * Whether to automatically set the horizontal scale of the encapsulated Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#adjustScaleX
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.adjustScaleX = true;

        /**
         * Whether to automatically set the vertical scale of the encapsulated Sprite.
         *
         * @name Phaser.GameObjects.Sprite3D#adjustScaleY
         * @type {boolean}
         * @default true
         * @since 3.0.0
         */
        this.adjustScaleY = true;

        /**
         * The visible state of the Game Object.
         *
         * @name Phaser.GameObjects.Sprite3D#_visible
         * @type {boolean}
         * @default true
         * @private
         * @since 3.0.0
         */
        this._visible = true;
    },

    /**
     * Project this Sprite onto the given 3D Camera.
     *
     * @method Phaser.GameObjects.Sprite3D#project
     * @since 3.0.0
     *
     * @param {Phaser.Cameras.Sprite3D.Camera} camera - The 3D Camera onto which to project this Sprite.
     */
    project: function (camera)
    {
        var pos = this.position;

        var gameObject = this.gameObject;

        camera.project(pos, gameObject);

        camera.getPointSize(pos, this.size, this.scale);

        if (this.scale.x <= 0 || this.scale.y <= 0)
        {
            gameObject.setVisible(false);
        }
        else
        {
            if (!gameObject.visible)
            {
                gameObject.setVisible(true);
            }

            if (this.adjustScaleX)
            {
                gameObject.scaleX = this.scale.x;
            }

            if (this.adjustScaleY)
            {
                gameObject.scaleY = this.scale.y;
            }

            gameObject.setDepth(gameObject.z * -1);
        }
    },

    /**
     * Set the visible state of the Game Object.
     *
     * @method Phaser.GameObjects.Sprite3D#setVisible
     * @since 3.0.0
     *
     * @param {boolean} value - The visible state of the Game Object.
     *
     * @return {Phaser.GameObjects.Sprite3D} This Sprite3D Object.
     */
    setVisible: function (value)
    {
        this.visible = value;

        return this;
    },

    /**
     * The visible state of the Game Object.
     *
     * An invisible Game Object will skip rendering, but will still process update logic.
     *
     * @name Phaser.GameObjects.Sprite3D#visible
     * @type {boolean}
     * @since 3.0.0
     */
    visible: {

        get: function ()
        {
            return this._visible;
        },

        set: function (value)
        {
            this._visible = value;
            this.gameObject.visible = value;
        }

    },

    /**
     * The x position of this Game Object.
     *
     * @name Phaser.GameObjects.Sprite3D#x
     * @type {number}
     * @since 3.0.0
     */
    x: {

        get: function ()
        {
            return this.position.x;
        },

        set: function (value)
        {
            this.position.x = value;
        }

    },

    /**
     * The y position of this Game Object.
     *
     * @name Phaser.GameObjects.Sprite3D#y
     * @type {number}
     * @since 3.0.0
     */
    y: {

        get: function ()
        {
            return this.position.y;
        },

        set: function (value)
        {
            this.position.y = value;
        }

    },

    /**
     * The z position of this Game Object.
     *
     * @name Phaser.GameObjects.Sprite3D#z
     * @type {number}
     * @since 3.0.0
     */
    z: {

        get: function ()
        {
            return this.position.z;
        },

        set: function (value)
        {
            this.position.z = value;
        }

    }

});

module.exports = Sprite3D;
