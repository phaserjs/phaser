/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Resume Event.
 *
 * This event is dispatched by a Scene when it is resumed from a paused state, either directly via the `resume` method,
 * or as an action from another Scene.
 *
 * Listen to it from a Scene using `this.events.on('resume', listener)`.
 *
 * @event Phaser.Scenes.Events#RESUME
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {any} [data] - An optional data object that was passed to this Scene when it was resumed.
 */
module.exports = 'resume';
