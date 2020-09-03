/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Stop Event.
 *
 * This event is dispatched by an Animation instance when playback is forcibly stopped on it,
 * i.e. `Sprite.stop()`, or similar, is called. Or, a new animation is started before the
 * previous one completes.
 *
 * @event Phaser.Animations.Events#ANIMATION_STOP
 * @since 3.50.0
 *
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that was stopped.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation stopped on.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation stopped.
 */
module.exports = 'stop';
