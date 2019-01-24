/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sprite Animation Complete Event.
 * 
 * This event is dispatched by a Sprite when an animation finishes playing on it.
 * 
 * Listen for it on the Sprite using `sprite.on('animationcomplete', listener)`
 * 
 * This same event is dispatched for all animations. To listen for a specific animation, use the `SPRITE_ANIMATION_KEY_COMPLETE` event.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_COMPLETE
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that completed.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation completed on.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation completed.
 */
module.exports = 'animationcomplete';
