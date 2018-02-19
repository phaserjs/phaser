/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * @namespace Phaser.Sound
 *
 * @author Pavle Goloskokovic <pgoloskokovic@gmail.com> (http://prunegames.com)
 */

/**
 * Config object containing various sound settings.
 *
 * @typedef {object} SoundConfig
 *
 * @property {boolean} [mute=false] - Boolean indicating whether the sound should be muted or not.
 * @property {number} [volume=1] - A value between 0 (silence) and 1 (full volume).
 * @property {number} [rate=1] - Defines the speed at which the sound should be played.
 * @property {number} [detune=0] - Represents detuning of sound in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
 * @property {number} [seek=0] - Position of playback for this sound, in seconds.
 * @property {boolean} [loop=false] - Whether or not the sound or current sound marker should loop.
 * @property {number} [delay=0] - Time, in seconds, that should elapse before the sound actually starts its playback.
 */

/**
 * Marked section of a sound represented by name, and optionally start time, duration, and config object.
 *
 * @typedef {object} SoundMarker
 *
 * @property {string} name - Unique identifier of a sound marker.
 * @property {number} [start=0] - Sound position offset at witch playback should start.
 * @property {number} [duration] - Playback duration of this marker.
 * @property {SoundConfig} [config] - An optional config object containing default marker settings.
 */

module.exports = {

    SoundManagerCreator: require('./SoundManagerCreator'),

    BaseSound: require('./BaseSound'),
    BaseSoundManager: require('./BaseSoundManager'),

    WebAudioSound: require('./webaudio/WebAudioSound'),
    WebAudioSoundManager: require('./webaudio/WebAudioSoundManager'),

    HTML5AudioSound: require('./html5/HTML5AudioSound'),
    HTML5AudioSoundManager: require('./html5/HTML5AudioSoundManager'),

    NoAudioSound: require('./noaudio/NoAudioSound'),
    NoAudioSoundManager: require('./noaudio/NoAudioSoundManager')

};
