/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @typedef {object} Phaser.Physics.Matter.Events.SleepEndEvent
 *
 * @property {any} source - The source object of the event.
 * @property {string} name - The name of the event.
 */

/**
 * The Matter Physics Sleep End Event.
 * 
 * This event is dispatched by a Matter Physics World instance when a Body stop sleeping.
 * 
 * Listen to it from a Scene using: `this.matter.world.on('sleepend', listener)`.
 *
 * @event Phaser.Physics.Matter.Events#SLEEP_END
 * 
 * @param {Phaser.Physics.Matter.Events.SleepEndEvent} event - The Sleep Event object.
 * @param {MatterJS.Body} body - The body that has stopped sleeping.
 */
module.exports = 'sleepend';
