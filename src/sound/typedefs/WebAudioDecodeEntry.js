/**
 * An entry in the Web Audio Decoding Queue.
 *
 * @typedef {object} Phaser.Types.Sound.WebAudioDecodeEntry
 * @since 3.60.0
 *
 * @property {string} key - The key of the sound.
 * @property {function} success - The callback to invoke on successful decoding.
 * @property {function} failure - The callback to invoke if the decoding fails.
 * @property {boolean} decoding - Has the decoding of this sound file started?
 */
