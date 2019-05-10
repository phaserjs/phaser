/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Animation Start Event.
 * 
 * This event is dispatched by an Animation instance when it starts playing.
 * 
 * Be careful with the volume of events this could generate. If a group of Sprites all play the same
 * animation at the same time, this event will invoke its handler for each one of them.
 *
 * @event Phaser.Animations.Events#ANIMATION_START
 * @since 3.16.1
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that started playing.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation started with.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation started playing.
 */
module.exports = 'start';
