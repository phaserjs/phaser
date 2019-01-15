/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Add Animation Event.
 * 
 * This event is dispatched when a new animation is added to the global Animation Manager.
 * 
 * This can happen either as a result of an animation instance being added to the Animation Manager,
 * or the Animation Manager creating a new animation directly.
 *
 * @event Phaser.Animations.Events#ADD_ANIMATION
 * 
 * @param {string} key - The key of the Animation that was added to the global Animation Manager.
 * @param {Phaser.Animations.Animation} animation - An instance of the newly created Animation.
 */
module.exports = 'add';
