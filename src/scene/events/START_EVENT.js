/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Start Event.
 *
 * This event is dispatched by a Scene during the Scene Systems start process. Primarily used by Scene Plugins.
 *
 * Listen to it from a Scene using `this.events.on('start', listener)`.
 *
 * @event Phaser.Scenes.Events#START
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 */
module.exports = 'start';
