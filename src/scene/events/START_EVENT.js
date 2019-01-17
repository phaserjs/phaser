/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Systems Start Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems start process. Primarily used by Scene Plugins.
 * 
 * Listen to it from a Scene using `this.scene.events.on('start', listener)`.
 * 
 * @event Phaser.Scenes.Events#START
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 */
module.exports = 'start';
