/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Scene Systems Shutdown Event.
 * 
 * This event is dispatched by a Scene during the Scene Systems shutdown process.
 * 
 * Listen to it from a Scene using `this.scene.events.on('shutdown', listener)`.
 * 
 * You should free-up any resources that may be in use by your Scene in this event handler, on the understanding
 * that the Scene may, at any time, become active again. A shutdown Scene is not 'destroyed', it's simply not
 * currently active. Use the [DESTROY]{@linkcode Phaser.Scenes.Events#event:DESTROY} event to completely clear resources.
 * 
 * @event Phaser.Scenes.Events#SHUTDOWN
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was shutdown.
 */
module.exports = 'shutdown';
