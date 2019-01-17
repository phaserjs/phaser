/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sound Manager Unlocked Event.
 * 
 * This event is dispatched by the Base Sound Manager, or more typically, an instance of the Web Audio Sound Manager,
 * or the HTML5 Audio Manager. It is dispatched during the update loop when the Sound Manager becomes unlocked. For
 * Web Audio this is on the first user gesture on the page.
 * 
 * Listen to it from a Scene using: `this.sound.on('unlocked', listener)`.
 *
 * @event Phaser.Sound.Events#UNLOCKED
 * 
 * @param {Phaser.Sound.BaseSoundManager} soundManager - A reference to the sound manager that emitted the event.
 */
module.exports = 'unlocked';
