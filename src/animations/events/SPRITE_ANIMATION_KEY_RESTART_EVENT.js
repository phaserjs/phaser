/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Sprite Animation Key Restart Event.
 * 
 * This event is dispatched by a Sprite when a specific animation restarts playing on it.
 * 
 * Listen for it on the Sprite using `sprite.on('animationrestart-key', listener)` where `key` is the key of
 * the animation. For example, if you had an animation with the key 'explode' you should listen for `animationrestart-explode`.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_KEY_RESTART
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that was restarted on the Sprite.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation restarted with.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation restarted playing.
 */
module.exports = 'animationrestart-';
