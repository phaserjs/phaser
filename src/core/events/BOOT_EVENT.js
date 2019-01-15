/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Game Boot Event.
 * 
 * This event is dispatched when the Phaser Game instance has finished booting, but before it is ready to start running.
 * The global systems use this event to know when to set themselves up, dispatching their own `ready` events as required.
 *
 * @event Phaser.Core.Events#BOOT
 */
module.exports = 'boot';
