/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
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
 * @since 3.16.2
 * 
 * @param {MatterJS.BodyType} body - The Body that has started being dragged. This is a Matter Body, not a Phaser Game Object.
 * @param {MatterJS.BodyType} part - The part of the body that was clicked on.
 * @param {Phaser.Physics.Matter.PointerConstraint} constraint - The Pointer Constraint that is dragging the body.
 */
module.exports = 'dragstart';
