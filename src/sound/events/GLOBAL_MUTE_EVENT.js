/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * The Sound Manager Global Mute Event.
 * 
 * This event is dispatched by the Sound Manager when its `mute` property is changed, either directly
 * or via the `setMute` method. This changes the mute state of all active sounds.
 * 
 * Listen to it from a Scene using: `this.sound.on('mute', listener)`.
 *
 * @event Phaser.Sound.Events#GLOBAL_MUTE
 * 
 * @param {(Phaser.Sound.WebAudioSoundManager|Phaser.Sound.HTML5AudioSoundManager)} soundManager - A reference to the sound manager that emitted the event.
 * @param {boolean} mute - The mute value. `true` if the Sound Manager is now muted, otherwise `false`.
 */
module.exports = 'mute';
