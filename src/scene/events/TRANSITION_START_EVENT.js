/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Transition Start Event.
 * 
 * This event is dispatched by a Scene during the Scene Transition process.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitionstart', listener)`.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_START
 * 
 * @param {Phaser.Scene} from - A reference to the Scene that is being transitioned from.
 * @param {number} duration - The duration of the transition in ms.
 */
module.exports = 'transitionstart';
