/**
 * Config object containing various sound settings.
 *
 * @typedef {object} Phaser.Types.Sound.SoundConfig
 * @since 3.0.0
 *
 * @property {boolean} [mute=false] - Boolean indicating whether the sound should be muted or not.
 * @property {number} [volume=1] - A value between 0 (silence) and 1 (full volume).
 * @property {number} [rate=1] - Defines the speed at which the sound should be played.
 * @property {number} [detune=0] - Represents detuning of sound in [cents](https://en.wikipedia.org/wiki/Cent_%28music%29).
 * @property {number} [seek=0] - Position of playback for this sound, in seconds.
 * @property {boolean} [loop=false] - Whether or not the sound or current sound marker should loop.
 * @property {number} [delay=0] - Time, in seconds, that should elapse before the sound actually starts its playback.
 */
