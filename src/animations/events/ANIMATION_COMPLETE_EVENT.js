/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Complete Event.
 * 
 * This event is dispatched by an Animation instance when it completes, i.e. finishes playing or is manually stopped.
 * 
 * Be careful with the volume of events this could generate. If a group of Sprites all complete the same
 * animation at the same time, this event will invoke its handler for each one of them.
 *
 * @event Phaser.Animations.Events#ANIMATION_COMPLETE
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that completed.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation completed on.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation completed.
 */
module.exports = 'complete';
