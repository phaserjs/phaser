/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Matter Physics Drag Start Event.
 * 
 * This event is dispatched by a Matter Physics World instance when a Pointer Constraint
 * starts dragging a body.
 * 
 * Listen to it from a Scene using: `this.matter.world.on('dragstart', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#DRAG_START
 * 
 * @param {MatterJS.Body} body - The Body that has started being dragged. This is a Matter Body, not a Phaser Game Object.
 * @param {MatterJS.Body} part - The part of the body that was clicked on.
 * @param {Phaser.Physics.Matter.PointerConstraint} constraint - The Pointer Constraint that is dragging the body.
 */
module.exports = 'dragstart';
