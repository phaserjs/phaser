/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Game Object Over Input Event.
 *
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer moves over _any_ interactive Game Object.
 *
 * Listen to this event from within a Scene using: `this.input.on('gameobjectover', listener)`.
 *
 * To receive this event, the Game Objects must have been set as interactive.
 * See [GameObject.setInteractive]{@link Phaser.GameObjects.GameObject#setInteractive} for more details.
 *
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_POINTER_OVER]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_OVER} event instead.
 *
 * The event hierarchy is as follows:
 *
 * 1. [GAMEOBJECT_POINTER_OVER]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_OVER}
 * 2. [GAMEOBJECT_OVER]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_OVER}
 * 3. [POINTER_OVER]{@linkcode Phaser.Input.Events#event:POINTER_OVER}
 *
 * With the top event being dispatched first and then flowing down the list. Note that higher-up event handlers can stop
 * the propagation of this event.
 *
 * @event Phaser.Input.Events#GAMEOBJECT_OVER
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The Game Object the pointer moved over.
 * @param {Phaser.Types.Input.EventData} event - The Phaser input event. You can call `stopPropagation()` to halt it from going any further in the event flow.
 */
module.exports = 'gameobjectover';
