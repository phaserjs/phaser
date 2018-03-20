/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('./components');
var Image = require('../../gameobjects/image/Image');

/**
 * @classdesc
 * An Impact Physics Image Game Object.
 * 
 * An Image is a light-weight Game Object useful for the display of static images in your game,
 * such as logos, backgrounds, scenery or other non-animated elements. Images can have input
 * events and physics bodies, or be tweened, tinted or scrolled. The main difference between an
 * Image and a Sprite is that you cannot animate an Image as they do not have the Animation component.
 *
 * @class ImpactImage
 * @extends Phaser.GameObjects.Image
 * @memberOf Phaser.Physics.Impact
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Impact.Components.Acceleration
 * @extends Phaser.Physics.Impact.Components.BodyScale
 * @extends Phaser.Physics.Impact.Components.BodyType
 * @extends Phaser.Physics.Impact.Components.Bounce
 * @extends Phaser.Physics.Impact.Components.CheckAgainst
 * @extends Phaser.Physics.Impact.Components.Collides
 * @extends Phaser.Physics.Impact.Components.Debug
 * @extends Phaser.Physics.Impact.Components.Friction
 * @extends Phaser.Physics.Impact.Components.Gravity
 * @extends Phaser.Physics.Impact.Components.Offset
 * @extends Phaser.Physics.Impact.Components.SetGameObject
 * @extends Phaser.Physics.Impact.Components.Velocity
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScaleMode
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Physics.Impact.World} world - [description]
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var ImpactImage = new Class({

    Extends: Image,

    Mixins: [
        Components.Acceleration,
        Components.BodyScale,
        Components.BodyType,
        Components.Bounce,
        Components.CheckAgainst,
        Components.Collides,
        Components.Debug,
        Components.Friction,
        Components.Gravity,
        Components.Offset,
        Components.SetGameObject,
        Components.Velocity
    ],

    initialize:

    function ImpactImage (world, x, y, texture, frame)
    {
        Image.call(this, world.scene, x, y, texture, frame);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#body
         * @type {Phaser.Physics.Impact.Body}
         * @since 3.0.0
         */
        this.body = world.create(x - this.frame.centerX, y - this.frame.centerY, this.width, this.height);

        this.body.parent = this;
        this.body.gameObject = this;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#size
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.size = this.body.size;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#offset
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.offset = this.body.offset;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#vel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.vel = this.body.vel;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#accel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.accel = this.body.accel;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#friction
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.friction = this.body.friction;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactImage#maxVel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.maxVel = this.body.maxVel;
    }

});

module.exports = ImpactImage;
