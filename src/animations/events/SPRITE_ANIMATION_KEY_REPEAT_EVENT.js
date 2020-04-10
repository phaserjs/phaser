/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sprite Animation Key Repeat Event.
 * 
 * This event is dispatched by a Sprite when a specific animation repeats playing on it.
 * 
 * Listen for it on the Sprite using `sprite.on('animationrepeat-key', listener)` where `key` is the key of
 * the animation. For example, if you had an animation with the key 'explode' you should listen for `animationrepeat-explode`.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_KEY_REPEAT
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that is repeating on the Sprite.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation started with.
 * @param {integer} repeatCount - The number of times the Animation has repeated so far.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation repeated playing.
 */
module.exports = 'animationrepeat-';
