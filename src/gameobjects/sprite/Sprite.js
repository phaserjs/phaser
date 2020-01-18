/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Class = require('../../utils/Class');
var Components = require('../components');
var GameObject = require('../GameObject');
var SpriteRender = require('./SpriteRender');

/**
 * @classdesc
 * A Sprite Game Object.
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
 * @extends Phaser.GameObjects.GameObject
 * @memberof Phaser.GameObjects
 * @constructor
 * @since 3.0.0
 *
 * @extends Phaser.GameObjects.Components.Alpha
 * @extends Phaser.GameObjects.Components.BlendMode
 * @extends Phaser.GameObjects.Components.Depth
 * @extends Phaser.GameObjects.Components.Flip
 * @extends Phaser.GameObjects.Components.GetBounds
 * @extends Phaser.GameObjects.Components.Mask
 * @extends Phaser.GameObjects.Components.Origin
 * @extends Phaser.GameObjects.Components.Pipeline
 * @extends Phaser.GameObjects.Components.ScrollFactor
 * @extends Phaser.GameObjects.Components.Size
 * @extends Phaser.GameObjects.Components.TextureCrop
 * @extends Phaser.GameObjects.Components.Tint
 * @extends Phaser.GameObjects.Components.Transform
 * @extends Phaser.GameObjects.Components.Visible
 *
 * @param {Phaser.Scene} scene - The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
 * @param {number} x - The horizontal position of this Game Object in the world.
 * @param {number} y - The vertical position of this Game Object in the world.
 * @param {string} texture - The key of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|integer)} [frame] - An optional frame from the Texture this Game Object is rendering with.
 */
var Sprite = new Class({

    Extends: GameObject,

    Mixins: [
        Components.Alpha,
        Components.BlendMode,
        Components.Depth,
        Components.Flip,
        Components.GetBounds,
        Components.Mask,
        Components.Origin,
        Components.Pipeline,
        Components.ScrollFactor,
        Components.Size,
        Components.TextureCrop,
        Components.Tint,
        Components.Transform,
        Components.Visible,
        SpriteRender
    ],

    initialize:

    function Sprite (scene, x, y, texture, frame)
    {
        GameObject.call(this, scene, 'Sprite');

        /**
         * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
         *
         * @name Phaser.GameObjects.Sprite#_crop
         * @type {object}
         * @private
         * @since 3.11.0
         */
        this._crop = this.resetCropObject();

        /**
         * The Animation Controller of this Sprite.
         *
         * @name Phaser.GameObjects.Sprite#anims
         * @type {Phaser.GameObjects.Components.Animation}
         * @since 3.0.0
         */
        this.anims = new Components.Animation(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initPipeline();
    },

    /**
     * Update this Sprite's animations.
     *
     * @method Phaser.GameObjects.Sprite#preUpdate
     * @protected
     * @since 3.0.0
     *
     * @param {number} time - The current timestamp.
     * @param {number} delta - The delta time, in ms, elapsed since the last frame.
     */
    preUpdate: function (time, delta)
    {
        this.anims.update(time, delta);
    },

    /**
     * Start playing the given animation.
     *
     * @method Phaser.GameObjects.Sprite#play
     * @since 3.0.0
     *
     * @param {string} key - The string-based key of the animation to play.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     * @param {integer} [startFrame=0] - Optionally start the animation playing from this frame index.
     *
     * @return {Phaser.GameObjects.Sprite} This Game Object.
     */
    play: function (key, ignoreIfPlaying, startFrame)
    {
        this.anims.play(key, ignoreIfPlaying, startFrame);

        return this;
    },

    /**
     * Build a JSON representation of this Sprite.
     *
     * @method Phaser.GameObjects.Sprite#toJSON
     * @since 3.0.0
     *
     * @return {Phaser.Types.GameObjects.JSONGameObject} A JSON representation of the Game Object.
     */
    toJSON: function ()
    {
        var data = Components.ToJSON(this);

        //  Extra Sprite data is added here

        return data;
    },

    /**
     * Handles the pre-destroy step for the Sprite, which removes the Animation component.
     *
     * @method Phaser.GameObjects.Sprite#preDestroy
     * @private
     * @since 3.14.0
     */
    preDestroy: function ()
    {
        this.anims.destroy();

        this.anims = undefined;
    }

});

module.exports = Sprite;
