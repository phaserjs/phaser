/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sprite Animation Key Update Event.
 * 
 * This event is dispatched by a Sprite when a specific animation playing on it updates. This happens when the animation changes frame,
 * based on the animation frame rate and other factors like `timeScale` and `delay`.
 * 
 * Listen for it on the Sprite using `sprite.on('animationupdate-key', listener)` where `key` is the key of
 * the animation. For example, if you had an animation with the key 'explode' you should listen for `animationupdate-explode`.
 *
 * @event Phaser.Animations.Events#SPRITE_ANIMATION_KEY_UPDATE
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that has updated on the Sprite.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame of the Animation.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation updated.
 */
module.exports = 'animationupdate-';
