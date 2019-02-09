/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Matter Physics Drag End Event.
 * 
 * This event is dispatched by a Matter Physics World instance when a Pointer Constraint
 * stops dragging a body.
 * 
 * Listen to it from a Scene using: `this.matter.world.on('dragend', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#DRAG_END
 * 
 * @param {MatterJS.Body} body - The Body that has stopped being dragged. This is a Matter Body, not a Phaser Game Object.
 * @param {Phaser.Physics.Matter.PointerConstraint} constraint - The Pointer Constraint that was dragging the body.
 */
module.exports = 'dragend';
