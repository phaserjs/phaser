/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Out Input Event.
 *
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer moves out of _any_ interactive Game Object.
 *
 * Listen to this event from within a Scene using: `this.input.on('gameobjectout', listener)`.
 *
 * To receive this event, the Game Objects must have been set as interactive.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 *
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_POINTER_OUT]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_OUT} event instead.
 *
 * The event hierarchy is as follows:
 *
 * 1. [GAMEOBJECT_POINTER_OUT]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_OUT}
 * 2. [GAMEOBJECT_OUT]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_OUT}
 * 3. [POINTER_OUT]{@linkcode Phaser.Input.Events#event:POINTER_OUT}
 *
 * With the top event being dispatched first and then flowing down the list. Note that higher-up event handlers can stop
 * the propagation of this event.
 *
 * If the pointer leaves the game canvas itself, it will not trigger an this event. To handle those cases,
 * please listen for the [GAME_OUT]{@linkcode Phaser.Input.Events#event:GAME_OUT} event.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_OUT
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object the pointer moved out of.
 * @param {Phaser.Types.Input.EventData} event - The Phaser input event. You can call `stopPropagation()` to halt it from going any further in the event flow.
 */
module.exports = 'gameobjectout';
