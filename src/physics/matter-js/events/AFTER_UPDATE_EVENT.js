/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.AfterUpdateEvent
 *
 * @property {number} timestamp - The Matter Engine `timing.timestamp` value for the event.
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics After Update Event.
 * 
 * This event is dispatched by a Matter Physics World instance after the engine has updated and all collision events have resolved.
 * 
 * Listen to it from a Scene using: `this.matter.world.on('afterupdate', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#AFTER_UPDATE
 * 
 * @param {Phaser.Physics.Matter.Events.AfterUpdateEvent} event - The Update Event object.
 */
module.exports = 'afterupdate';
