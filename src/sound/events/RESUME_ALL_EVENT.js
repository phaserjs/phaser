/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Resume All Sounds Event.
 * 
 * This event is dispatched by the Base Sound Manager, or more typically, an instance of the Web Audio Sound Manager,
 * or the HTML5 Audio Manager. It is dispatched when the `resumeAll` method is invoked and after all current Sounds
 * have been resumed.
 * 
 * Listen to it from a Scene using: `this.sound.on('resumeall', listener)`.
 *
 * @event Phaser.Sound.Events#RESUME_ALL
 * 
 * @param {Phaser.Sound.BaseSoundManager} soundManager - A reference to the sound manager that emitted the event.
 */
module.exports = 'resumeall';
