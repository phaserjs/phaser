/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Animation Restart Event.
 * 
 * This event is dispatched by an Animation instance when it restarts.
 * 
 * Be careful with the volume of events this could generate. If a group of Sprites all restart the same
 * animation at the same time, this event will invoke its handler for each one of them.
 *
 * @event Phaser.Animations.Events#ANIMATION_RESTART
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that restarted playing.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation restarted with.
 * @param {Phaser.GameObjects.Sprite} gameObject - A reference to the Game Object on which the animation restarted playing.
 */
module.exports = 'restart';
