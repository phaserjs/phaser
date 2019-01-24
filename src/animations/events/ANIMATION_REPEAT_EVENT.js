/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Animation Repeat Event.
 * 
 * This event is dispatched when a currently playing animation repeats.
 * 
 * The event is dispatched directly from the Animation object itself. Which means that listeners
 * bound to this event will be invoked every time the Animation repeats, for every Game Object that may have it.
 *
 * @event Phaser.Animations.Events#ANIMATION_REPEAT
 * 
 * @param {Phaser.Animations.Animation} animation - A reference to the Animation that repeated.
 * @param {Phaser.Animations.AnimationFrame} frame - The current Animation Frame that the Animation was on when it repeated.
 */
module.exports = 'repeat';
