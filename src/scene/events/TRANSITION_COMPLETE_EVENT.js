/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Transition Complete Event.
 * 
 * This event is dispatched by a Scene when the Scene Transition process completes.
 * 
 * Listen to it from a Scene using `this.scene.events.on('transitioncomplete', listener)`.
 * 
 * @event Phaser.Scenes.Events#TRANSITION_COMPLETE
 * 
 * @param {Phaser.Scene} scene -The Scene on which the transitioned completed.
 */
module.exports = 'transitioncomplete';
