/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var AnimationState = require('../../animations/AnimationState');
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
 * @extends Phaser.GameObjects.Components.PostPipeline
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
 * @param {(string|Phaser.Textures.Texture)} texture - The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
 * @param {(string|number)} [frame] - An optional frame from the Texture this Game Object is rendering with.
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
        Components.PostPipeline,
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
         * The Animation State component of this Sprite.
         *
         * This component provides features to apply animations to this Sprite.
         * It is responsible for playing, loading, queuing animations for later playback,
         * mixing between animations and setting the current animation frame to this Sprite.
         *
         * @name Phaser.GameObjects.Sprite#anims
         * @type {Phaser.Animations.AnimationState}
         * @since 3.0.0
         */
        this.anims = new AnimationState(this);

        this.setTexture(texture, frame);
        this.setPosition(x, y);
        this.setSizeToFrame();
        this.setOriginFromFrame();
        this.initPipeline();
        this.initPostPipeline(true);
    },

    //  Overrides Game Object method
    addedToScene: function ()
    {
        this.scene.sys.updateList.add(this);
    },

    //  Overrides Game Object method
    removedFromScene: function ()
    {
        this.scene.sys.updateList.remove(this);
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
     * Start playing the given animation on this Sprite.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).play('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).play({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.GameObjects.Sprite#play
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.0.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {this} This Game Object.
     */
    play: function (key, ignoreIfPlaying)
    {
        return this.anims.play(key, ignoreIfPlaying);
    },

    /**
     * Start playing the given animation on this Sprite, in reverse.
     *
     * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
     *
     * The benefit of a global animation is that multiple Sprites can all play the same animation, without
     * having to duplicate the data. You can just create it once and then play it on any Sprite.
     *
     * The following code shows how to create a global repeating animation. The animation will be created
     * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
     *
     * ```javascript
     * var config = {
     *     key: 'run',
     *     frames: 'muybridge',
     *     frameRate: 15,
     *     repeat: -1
     * };
     *
     * //  This code should be run from within a Scene:
     * this.anims.create(config);
     * ```
     *
     * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
     * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
     * creating a global animation, however the resulting data is kept locally in this Sprite.
     *
     * With the animation created, either globally or locally, you can now play it on this Sprite:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse('run');
     * ```
     *
     * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
     * object instead:
     *
     * ```javascript
     * this.add.sprite(x, y).playReverse({ key: 'run', frameRate: 24 });
     * ```
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * If you need a Sprite to be able to play both local and global animations, make sure they don't
     * have conflicting keys.
     *
     * See the documentation for the `PlayAnimationConfig` config object for more details about this.
     *
     * Also, see the documentation in the Animation Manager for further details on creating animations.
     *
     * @method Phaser.GameObjects.Sprite#playReverse
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {boolean} [ignoreIfPlaying=false] - If an animation is already playing then ignore this call.
     *
     * @return {this} This Game Object.
     */
    playReverse: function (key, ignoreIfPlaying)
    {
        return this.anims.playReverse(key, ignoreIfPlaying);
    },

    /**
     * Waits for the specified delay, in milliseconds, then starts playback of the given animation.
     *
     * If the animation _also_ has a delay value set in its config, it will be **added** to the delay given here.
     *
     * If an animation is already running and a new animation is given to this method, it will wait for
     * the given delay before starting the new animation.
     *
     * If no animation is currently running, the given one begins after the delay.
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * Prior to Phaser 3.50 this method was called 'delayedPlay'.
     *
     * @method Phaser.GameObjects.Sprite#playAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {number} delay - The delay, in milliseconds, to wait before starting the animation playing.
     *
     * @return {this} This Game Object.
     */
    playAfterDelay: function (key, delay)
    {
        return this.anims.playAfterDelay(key, delay);
    },

    /**
     * Waits for the current animation to complete the `repeatCount` number of repeat cycles, then starts playback
     * of the given animation.
     *
     * You can use this to ensure there are no harsh jumps between two sets of animations, i.e. going from an
     * idle animation to a walking animation, by making them blend smoothly into each other.
     *
     * If no animation is currently running, the given one will start immediately.
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * @method Phaser.GameObjects.Sprite#playAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_START
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig)} key - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
     * @param {number} [repeatCount=1] - How many times should the animation repeat before the next one starts?
     *
     * @return {this} This Game Object.
     */
    playAfterRepeat: function (key, repeatCount)
    {
        return this.anims.playAfterRepeat(key, repeatCount);
    },

    /**
     * Sets an animation, or an array of animations, to be played immediately after the current one completes or stops.
     *
     * The current animation must enter a 'completed' state for this to happen, i.e. finish all of its repeats, delays, etc,
     * or have the `stop` method called directly on it.
     *
     * An animation set to repeat forever will never enter a completed state.
     *
     * You can chain a new animation at any point, including before the current one starts playing, during it,
     * or when it ends (via its `animationcomplete` event).
     *
     * Chained animations are specific to a Game Object, meaning different Game Objects can have different chained
     * animations without impacting the animation they're playing.
     *
     * Call this method with no arguments to reset all currently chained animations.
     *
     * When playing an animation on a Sprite it will first check to see if it can find a matching key
     * locally within the Sprite. If it can, it will play the local animation. If not, it will then
     * search the global Animation Manager and look for it there.
     *
     * @method Phaser.GameObjects.Sprite#chain
     * @since 3.50.0
     *
     * @param {(string|Phaser.Animations.Animation|Phaser.Types.Animations.PlayAnimationConfig|string[]|Phaser.Animations.Animation[]|Phaser.Types.Animations.PlayAnimationConfig[])} [key] - The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object, or an array of them.
     *
     * @return {this} This Game Object.
     */
    chain: function (key)
    {
        return this.anims.chain(key);
    },

    /**
     * Immediately stops the current animation from playing and dispatches the `ANIMATION_STOP` events.
     *
     * If no animation is playing, no event will be dispatched.
     *
     * If there is another animation queued (via the `chain` method) then it will start playing immediately.
     *
     * @method Phaser.GameObjects.Sprite#stop
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @return {this} This Game Object.
     */
    stop: function ()
    {
        return this.anims.stop();
    },

    /**
     * Stops the current animation from playing after the specified time delay, given in milliseconds.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Sprite#stopAfterDelay
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {number} delay - The number of milliseconds to wait before stopping this animation.
     *
     * @return {this} This Game Object.
     */
    stopAfterDelay: function (delay)
    {
        return this.anims.stopAfterDelay(delay);
    },

    /**
     * Stops the current animation from playing after the given number of repeats.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Sprite#stopAfterRepeat
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {number} [repeatCount=1] - How many times should the animation repeat before stopping?
     *
     * @return {this} This Game Object.
     */
    stopAfterRepeat: function (repeatCount)
    {
        return this.anims.stopAfterRepeat(repeatCount);
    },

    /**
     * Stops the current animation from playing when it next sets the given frame.
     * If this frame doesn't exist within the animation it will not stop it from playing.
     *
     * It then dispatches the `ANIMATION_STOP` event.
     *
     * If no animation is running, no events will be dispatched.
     *
     * If there is another animation in the queue (set via the `chain` method) then it will start playing,
     * when the current one stops.
     *
     * @method Phaser.GameObjects.Sprite#stopOnFrame
     * @fires Phaser.Animations.Events#ANIMATION_STOP
     * @since 3.50.0
     *
     * @param {Phaser.Animations.AnimationFrame} frame - The frame to check before stopping this animation.
     *
     * @return {this} This Game Object.
     */
    stopOnFrame: function (frame)
    {
        return this.anims.stopOnFrame(frame);
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
        return Components.ToJSON(this);
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
