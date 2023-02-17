/**
 * Config object containing settings for the source of the spatial sound.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Web_audio_spatialization_basics
 *
 * @typedef {object} Phaser.Types.Sound.SpatialSoundConfig
 * @since 3.60.0
 *
 * @property {number} [x=0] - The horizontal position of the audio in a right-hand Cartesian coordinate system.
 * @property {number} [y=0] - The vertical position of the audio in a right-hand Cartesian coordinate system.
 * @property {number} [z=0] - Represents the longitudinal (back and forth) position of the audio in a right-hand Cartesian coordinate system.
 * @property {('equalpower'|'HRTF')} [panningModel='equalpower'] - An enumerated value determining which spatialization algorithm to use to position the audio in 3D space.
 * @property {('linear'|'inverse'|'exponential')} [distanceModel='inverse'] - Which algorithm to use to reduce the volume of the audio source as it moves away from the listener. Possible values are "linear", "inverse" and "exponential". The default value is "inverse".
 * @property {number} [orientationX=0] - The horizontal position of the audio source's vector in a right-hand Cartesian coordinate system.
 * @property {number} [orientationY=0] - The vertical position of the audio source's vector in a right-hand Cartesian coordinate system.
 * @property {number} [orientationZ=-1] - Represents the longitudinal (back and forth) position of the audio source's vector in a right-hand Cartesian coordinate system.
 * @property {number} [refDistance=1] - A double value representing the reference distance for reducing volume as the audio source moves further from the listener. For distances greater than this the volume will be reduced based on `rolloffFactor` and `distanceModel`.
 * @property {number} [maxDistance=10000] - The maximum distance between the audio source and the listener, after which the volume is not reduced any further.
 * @property {number} [rolloffFactor=1] - A double value describing how quickly the volume is reduced as the source moves away from the listener. This value is used by all distance models.
 * @property {number} [coneInnerAngle=360] - The angle, in degrees, of a cone inside of which there will be no volume reduction.
 * @property {number} [coneOuterAngle=0] - The angle, in degrees, of a cone outside of which the volume will be reduced by a constant value, defined by the `coneOuterGain` property.
 * @property {number} [coneOuterGain=0] - The amount of volume reduction outside the cone defined by the `coneOuterAngle` attribute. Its default value is 0, meaning that no sound can be heard. A value between 0 and 1.
 * @property {Phaser.Types.Math.Vector2Like} [follow] - Set this Sound object to automatically track the x/y position of this object. Can be a Phaser Game Object, Vec2 or anything that exposes public x/y properties.
 */
