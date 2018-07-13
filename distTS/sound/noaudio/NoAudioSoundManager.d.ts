/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @author       Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var BaseSoundManager: any;
declare var Class: any;
declare var EventEmitter: any;
declare var NoAudioSound: any;
declare var NOOP: any;
/**
 * @classdesc
 * No audio implementation of the sound manager. It is used if audio has been
 * disabled in the game config or the device doesn't support any audio.
 *
 * It represents a graceful degradation of sound manager logic that provides
 * minimal functionality and prevents Phaser projects that use audio from
 * breaking on devices that don't support any audio playback technologies.
 *
 * @class NoAudioSoundManager
 * @extends Phaser.Sound.BaseSoundManager
 * @memberOf Phaser.Sound
 * @constructor
 * @since 3.0.0
 *
 * @param {Phaser.Game} game - Reference to the current game instance.
 */
declare var NoAudioSoundManager: any;
