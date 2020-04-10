/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sprite Animation Restart Event.
 * 
 * This event is dispatched by a Sprite when an animation restarts playing on it.
 * 
 * Listen for it on the Sprite using `sprite.on('animationrestart', listener)`
 * 
 * This same event is dispatched for all animations. To listen for a specific animation, use the `SPRITE_ANIMATION_KEY_RESTART` event.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_RESTART
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that was restarted on the Sprite.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation restarted with.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation restarted playing.
 */
module.exports = 'animationrestart';
