/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sprite Animation Repeat Event.
 * 
 * This event is dispatched by a Sprite when an animation repeats playing on it.
 * 
 * Listen for it on the Sprite using `sprite.on('animationrepeat', listener)`
 * 
 * This same event is dispatched for all animations. To listen for a specific animation, use the `SPRITE_ANIMATION_KEY_REPEAT` event.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_REPEAT
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that is repeating on the Sprite.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation started with.
 * @param {integer} repeatCount - The number of times the Animation has repeated so far.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation repeated playing.
 */
module.exports = 'animationrepeat';
