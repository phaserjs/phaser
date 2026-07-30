/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('./components');
var Image = require('../../gameobjects/image/Image');

/**
 * @classdesc
 * An Arcade Physics Image is a standard Image Game Object with an Arcade Physics body and related
 * physics components mixed in. It is the lightest-weight physics-enabled Game Object available in
 * Arcade Physics, making it ideal for static scenery, collectibles, platforms, bullets, or any
 * non-animated object that needs to participate in physics collisions and overlap checks.
 *
 * The physics body can be either dynamic (affected by velocity, acceleration, and gravity) or
 * static (immovable, used for platforms and boundaries). Physics behaviour is controlled via the
 * mixed-in Arcade Physics components such as Velocity, Acceleration, Bounce, Gravity, and so on.
 *
 * The key difference between an Arcade Image and an Arcade Sprite is that an Arcade Image cannot
 * play texture-based animations. If you need frame animations, use `Phaser.Physics.Arcade.Sprite`
 * instead. If you only need a static or programmatically-moved object without animations, the
 * Arcade Image is the more efficient choice.
 *
 * You should not normally create an ArcadeImage directly. Instead, use the factory method
 * `this.physics.add.image()` from within a Scene, which creates the image and adds its body
 * to the Arcade Physics world automatically.
 *
 * @class Image
 * @extends Phaser.GameObjects.Image
 * @memberof Phaser.Physics.Arcade
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.Physics.Arcade.Components.Acceleration
 * @extends Phaser.Physics.Arcade.Components.Angular
 * @extends Phaser.Physics.Arcade.Components.Bounce
 * @extends Phaser.Physics.Arcade.Components.Collision
 * @extends Phaser.Physics.Arcade.Components.Debug
 * @extends Phaser.Physics.Arcade.Components.Drag
 * @extends Phaser.Physics.Arcade.Components.Enable
 * @extends Phaser.Physics.Arcade.Components.Friction
 * @extends Phaser.Physics.Arcade.Components.Gravity
 * @extends Phaser.Physics.Arcade.Components.Immovable
 * @extends Phaser.Physics.Arcade.Components.Mass
 * @extends Phaser.Physics.Arcade.Components.Pushable
 * @extends Phaser.Physics.Arcade.Components.Size
 * @extends Phaser.Physics.Arcade.Components.Velocity
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.Texture
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var ArcadeImage = new Class({

    Extends: Image,

    Mixins: [
        Components.Acceleration,
        Components.Angular,
        Components.Bounce,
        Components.Collision,
        Components.Debug,
        Components.Drag,
        Components.Enable,
        Components.Friction,
        Components.Gravity,
        Components.Immovable,
        Components.Mass,
        Components.Pushable,
        Components.Size,
        Components.Velocity
    ],

    initialize:

    function ArcadeImage (scene, x, y, texture, frame)
    {
        Image.call(this, scene, x, y, texture, frame);

        /**
         * This Game Object's Physics Body.
         *
         * @name Phaser.Physics.Arcade.Image#body
         * @type {?(Phaser.Physics.Arcade.Body|Phaser.Physics.Arcade.StaticBody)}
         * @default null
         * @since 3.0.0
         */
        this.body = null;
    }

});

module.exports = ArcadeImage;
