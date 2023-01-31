/**
 * Config object containing settings for the source of the spatial sound.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
 *
 * @typedef {object} Phaser.Types.Sound.SpatialSoundConfig
 * @since 3.60.0
 *
 * @property {number} [x=0] - X coordinate for the source of the sound.
 * @property {number} [y=0] - Y coordinate for the source of the sound.
 * @property {number} [z=0] - Z coordinate for the source of the sound.
 * @property {('equalpower'|'HRTF')} [panningModel='equalpower'] - The spacialization algorithm that's used to position the audio in 3D space.
 * @property {('linear'|'inverse'|'exponential')} [distanceModel='inverse'] - Different algorithms which are used to reduce the volume of the audio source as it moves away from the listener.
 * @property {number} [orientationX=0] - X orientation of the sound.
 * @property {number} [orientationY=0] - Y orientation of the sound.
 * @property {number} [orientationZ=-1.0] - Z orientation of the sound.
 * @property {number} [refDistance=1] - Used by the distance models.
 * @property {number} [maxDistance=10000] - Maximum distance between the source and the listener.
 * @property {number} [rolloffFactor=1] - How quickly the volume is reduced as the panner moves away from the listener.
 * @property {number} [coneInnerAngle=360] - Specifies where the sound emanates from.
 * @property {number} [coneOuterAngle=0] - Specifies where the volume starts to drop away.
 * @property {number} [coneOuterGain=0] - Specifies the amount volume is reduced by.
 */
