/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Class: any;
/**
 * This event is dispatched when an animation starts playing.
 *
 * @event Phaser.GameObjects.Components.Animation#onStartEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 */
/**
 * This event is dispatched when an animation repeats.
 *
 * @event Phaser.GameObjects.Components.Animation#onRepeatEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 * @param {integer} repeatCount - The number of times this animation has repeated.
 */
/**
 * This event is dispatched when an animation updates. This happens when the animation frame changes,
 * based on the animation frame rate and other factors like timeScale and delay.
 *
 * @event Phaser.GameObjects.Components.Animation#onUpdateEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 */
/**
 * This event is dispatched when an animation completes playing, either naturally or via Animation.stop.
 *
 * @event Phaser.GameObjects.Components.Animation#onCompleteEvent
 * @param {Phaser.Animations.Animation} animation - Reference to the currently playing animation.
 * @param {Phaser.Animations.AnimationFrame} frame - Reference to the current Animation Frame.
 */
/**
 * @classdesc
 * A Game Object Animation Controller.
 *
 * This controller lives as an instance within a Game Object, accessible as `sprite.anims`.
 *
 * @class Animation
 * @memberOf Phaser.GameObjects.Components
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.GameObjects.GameObject} parent - The Game Object to which this animation controller belongs.
 */
declare var Animation: {
    new (effect?: AnimationEffectReadOnly, timeline?: AnimationTimeline): Animation;
    prototype: Animation;
};
