/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
var Class = require('../../utils/Class');
var Components = require('./components');
var GameObject = require('../../gameobjects/GameObject');
var GetFastValue = require('../../utils/object/GetFastValue');
var Pipeline = require('../../gameobjects/components/Pipeline');
var Sprite = require('../../gameobjects/sprite/Sprite');
var Vector2 = require('../../math/Vector2');

/**
 * @classdesc
 * A Matter Physics Sprite Game Object.
 *
 * A Sprite Game Object is used for the display of both static and animated images in your game.
 * Sprites can have input events and physics bodies. They can also be tweened, tinted, scrolled
 * and animated.
 *
 * The main difference between a Sprite and an Image Game Object is that you cannot animate Images.
 * As such, Sprites take a fraction longer to process and have a larger API footprint due to the Animation
 * Component. If you do not require animation then you can safely use Images to replace Sprites in all cases.
 *
 * @class Sprite
 * @extends Phaser.GameObjects.Sprite
 * @memberof Phaser.Physics.Matter
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Matter.Components.Bounce
 * @extends Phaser.Physics.Matter.Components.Collision
 * @extends Phaser.Physics.Matter.Components.Force
 * @extends Phaser.Physics.Matter.Components.Friction
 * @extends Phaser.Physics.Matter.Components.Gravity
 * @extends Phaser.Physics.Matter.Components.Mass
 * @extends Phaser.Physics.Matter.Components.Sensor
 * @extends Phaser.Physics.Matter.Components.SetBody
 * @extends Phaser.Physics.Matter.Components.Sleep
 * @extends Phaser.Physics.Matter.Components.Static
 * @extends Phaser.Physics.Matter.Components.Transform
 * @extends Phaser.Physics.Matter.Components.Velocity
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
 * @param {Phaser.Physics.Matter.World} world - A reference to the Matter.World instance that this body belongs to.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 * @param {Phaser.Types.Physics.Matter.MatterBodyConfig} [options] - An optional Body configuration object that is used to set initial Body properties on creation.
 */
var MatterSprite = new Class({

    Extends: Sprite,

    Mixins: [
        Components.Bounce,
        Components.Collision,
        Components.Force,
        Components.Friction,
        Components.Gravity,
        Components.Mass,
        Components.Sensor,
        Components.SetBody,
        Components.Sleep,
        Components.Static,
        Components.Transform,
        Components.Velocity,
        Pipeline
    ],

    initialize:

    function MatterSprite (world, x, y, texture, frame, options)
    {
        GameObject.call(this, world.scene, 'Sprite');

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.Physics.Matter.Sprite#_crop
         * @type {object}
         * @private
         * @since 3.24.0
         */
        this._crop = this.resetCropObject();

        this.anims = new AnimationState(this);

        this.setTexture(texture, frame);
        this.setSizeToFrame();
        this.setOrigin();

        /**
         * A reference to the Matter.World instance that this body belongs to.
         *
         * @name Phaser.Physics.Matter.Sprite#world
         * @type {Phaser.Physics.Matter.World}
         * @since 3.0.0
         */
        this.world = world;

        /**
         * An internal temp vector used for velocity and force calculations.
         *
         * @name Phaser.Physics.Matter.Sprite#_tempVec2
         * @type {Phaser.Math.Vector2}
         * @private
         * @since 3.0.0
         */
        this._tempVec2 = new Vector2(x, y);

        var shape = GetFastValue(options, 'shape', null);

        if (shape)
        {
            this.setBody(shape, options);
        }
        else
        {
            this.setRectangle(this.width, this.height, options);
        }

        this.setPosition(x, y);

        this.initPipeline();
    }

});

module.exports = MatterSprite;
