/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * The Pointer Drag End Input Event.
 *
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer stops dragging a Game Object.
 *
 * Listen to this event from within a Scene using: `this.input.on('dragend', listener)`.
 *
 * To listen for this event from a _specific_ Game Object, use the [GAMEOBJECT_DRAG_END]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DRAG_END} event instead.
 *
 * @event Phaser.Input.Events#DRAG_END
 * @type {string}
 * @since 3.0.0
 *
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 * @param {Phaser.GameObjects.GameObject} gameObject - The interactive Game Object that this pointer stopped dragging.
 * @param {boolean} dropped - Whether the Game Object was dropped onto a target.
 */
module.exports = 'dragend';
