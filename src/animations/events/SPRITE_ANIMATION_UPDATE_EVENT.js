/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sprite Animation Update Event.
 * 
 * This event is dispatched by a Sprite when an animation playing on it updates. This happens when the animation changes frame,
 * based on the animation frame rate and other factors like `timeScale` and `delay`.
 * 
 * Listen for it on the Sprite using `sprite.on('animationupdate', listener)`
 * 
 * This same event is dispatched for all animations. To listen for a specific animation, use the `SPRITE_ANIMATION_KEY_UPDATE` event.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_UPDATE
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has updated on the Sprite.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation updated.
 */
module.exports = 'animationupdate';
