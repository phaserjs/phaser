/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Pointer Down Outside Input Event.
 * 
 * This event is dispatched by the Input Plugin belonging to a Scene if a pointer is pressed down anywhere outside of the game canvas.
 * 
 * Listen to this event from within a Scene using: `this.input.on('pointerdownoutside', listener)`.
 * 
 * The event hierarchy is as follows:
 * 
 * 1. [GAMEOBJECT_POINTER_DOWN]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_POINTER_DOWN}
 * 2. [GAMEOBJECT_DOWN]{@linkcode Phaser.Input.Events#event:GAMEOBJECT_DOWN}
 * 3. [POINTER_DOWN]{@linkcode Phaser.Input.Events#event:POINTER_DOWN} or [POINTER_DOWN_OUTSIDE]{@linkcode Phaser.Input.Events#event:POINTER_DOWN_OUTSIDE}
 * 
 * With the top event being dispatched first and then flowing down the list. Note that higher-up event handlers can stop
 * the propagation of this event.
 *
 * @event Phaser.Input.Events#POINTER_DOWN_OUTSIDE
 * 
 * @param {Phaser.Input.Pointer} pointer - The Pointer responsible for triggering this event.
 */
module.exports = 'pointerdownoutside';
