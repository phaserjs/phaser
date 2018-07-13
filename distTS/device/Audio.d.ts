/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Browser: any;
/**
 * Determines the audio playback capabilities of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.audio` from within any Scene.
 *
 * @typedef {object} Phaser.Device.Audio
 * @since 3.0.0
 *
 * @property {boolean} audioData - Can this device play HTML Audio tags?
 * @property {boolean} dolby - Can this device play EC-3 Dolby Digital Plus files?
 * @property {boolean} m4a - Can this device can play m4a files.
 * @property {boolean} mp3 - Can this device play mp3 files?
 * @property {boolean} ogg - Can this device play ogg files?
 * @property {boolean} opus - Can this device play opus files?
 * @property {boolean} wav - Can this device play wav files?
 * @property {boolean} webAudio - Does this device have the Web Audio API?
 * @property {boolean} webm - Can this device play webm files?
 */
declare var Audio: new (src?: string) => HTMLAudioElement;
