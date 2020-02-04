/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('./components');
var Sprite = require('../../gameobjects/sprite/Sprite');

/**
 * @classdesc
 * An Impact Physics Sprite Game Object.
 *
 * A Sprite Game Object is used for the display of both static and animated images in your game.
 * Sprites can have input events and physics bodies. They can also be tweened, tinted, scrolled
 * and animated.
 *
 * The main difference between a Sprite and an Image Game Object is that you cannot animate Images.
 * As such, Sprites take a fraction longer to process and have a larger API footprint due to the Animation
 * Component. If you do not require animation then you can safely use Images to replace Sprites in all cases.
 *
 * @class ImpactSprite
 * @extends Phaser.GameObjects.Sprite
 * @memberof Phaser.Physics.Impact
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
var ImpactSprite = new Class({

    Extends: Sprite,

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

    function ImpactSprite (world, x, y, texture, frame)
    {
        Sprite.call(this, world.scene, x, y, texture, frame);

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#body
         * @type {Phaser.Physics.Impact.Body}
         * @since 3.0.0
         */
        this.body = world.create(x - this.frame.centerX, y - this.frame.centerY, this.width, this.height);

        this.body.parent = this;
        this.body.gameObject = this;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#size
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.size = this.body.size;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#offset
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.offset = this.body.offset;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#vel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.vel = this.body.vel;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#accel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.accel = this.body.accel;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#friction
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.friction = this.body.friction;

        /**
         * [description]
         *
         * @name Phaser.Physics.Impact.ImpactSprite#maxVel
         * @type {{x: number, y: number}}
         * @since 3.0.0
         */
        this.maxVel = this.body.maxVel;
    }

});

module.exports = ImpactSprite;
