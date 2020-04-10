/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Wake Event.
 * 
 * This event is dispatched by a Scene when it is woken from sleep, either directly via the `wake` method,
 * or as an action from another Scene.
 * 
 * Listen to it from a Scene using `this.scene.events.on('wake', listener)`.
 * 
 * @event Phaser.Scenes.Events#WAKE
 * @since 3.0.0
 * 
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was woken up.
 */
module.exports = 'wake';
