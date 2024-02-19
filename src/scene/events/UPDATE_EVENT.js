/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Scene Systems Update Event.
 *
 * This event is dispatched by a Scene during the main game loop step.
 *
 * The event flow for a single step of a Scene is as follows:
 *
 * 1. [PRE_UPDATE]{@linkcode Phaser.Scenes.Events#event:PRE_UPDATE}
 * 2. [UPDATE]{@linkcode Phaser.Scenes.Events#event:UPDATE}
 * 3. The `Scene.update` method is called, if it exists and the Scene is in a Running state, otherwise this is skipped.
 * 4. [POST_UPDATE]{@linkcode Phaser.Scenes.Events#event:POST_UPDATE}
 * 5. [PRE_RENDER]{@linkcode Phaser.Scenes.Events#event:PRE_RENDER}
 * 6. [RENDER]{@linkcode Phaser.Scenes.Events#event:RENDER}
 *
 * Listen to it from a Scene using `this.events.on('update', listener)`.
 *
 * A Scene will only run its step if it is active.
 *
 * @event Phaser.Scenes.Events#UPDATE
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Scenes.Systems} sys - A reference to the Scene Systems class of the Scene that emitted this event.
 * @param {number} time - The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
 * @param {number} delta - The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
 */
module.exports = 'update';
