/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Systems Destroy Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems destroy process.
 * 
 * Listen to it from a Scene using `this.scene.events.on('destroy', listener)`.
 * 
 * You should destroy any resources that may be in use by your Scene in this event handler.
 * 
 * @event Phaser.Scenes.Events#DESTROY
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 */
module.exports = 'destroy';
