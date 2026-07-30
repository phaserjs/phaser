# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## New Feature - Spatial Sound

Thanks to a contribution from @alxwest the Web Audio Sound system now supports spatial sound. The Web Audio Sound Manager now has the ability to set the listener position and each sound can be positioned in 3D space:

```js
this.music = this.sound.add('theme');

this.sound.setListenerPosition(400, 300);

this.music.play({
    loop: true,
    source: {
        x: 400,
        y: 300,
        refDistance: 50,
        follow: this.playerSprite
    }
});
```

This allows you to create a 3D sound environment in your game. The following new methods and properties have been added to the Web Audio Sound Manager and Web Audio Sound classes:

* `SpatialSoundConfig` is a new configuration object that contains the properties required to create and set the values of a spatial sound:
* `SpatialSoundConfig.x` sets the horizontal position of the audio in a right-hand Cartesian coordinate system.
* `SpatialSoundConfig.y` sets the vertical position of the audio in a right-hand Cartesian coordinate system.
* `SpatialSoundConfig.z` sets the longitudinal (back and forth) position of the audio in a right-hand Cartesian coordinate system.
* `SpatialSoundConfig.panningModel` is an enumerated value determining which spatialization algorithm to use to position the audio in 3D space. Can be either `equalpower` or `HRTF`. The default value is `equalpower`.
* `SpatialSoundConfig.distanceModel` sets which algorithm to use to reduce the volume of the audio source as it moves away from the listener. Possible values are "linear", "inverse" and "exponential". The default value is "inverse".
* `SpatialSoundConfig.orientationX` sets the horizontal position of the audio source's vector in a right-hand Cartesian coordinate system.
* `SpatialSoundConfig.orientationY` sets the vertical position of the audio source's vector in a right-hand Cartesian coordinate system.
* `SpatialSoundConfig.orientationZ` sets the longitudinal (back and forth) position of the audio source's vector in a right-hand Cartesian coordinate system.
* `SpatialSoundConfig.refDistance` is a double value representing the reference distance for reducing volume as the audio source moves further from the listener. For distances greater than this the volume will be reduced based on `rolloffFactor` and `distanceModel`.
* `SpatialSoundConfig.maxDistance` is the maximum distance between the audio source and the listener, after which the volume is not reduced any further.
* `SpatialSoundConfig.rolloffFactor` is a double value describing how quickly the volume is reduced as the source moves away from the listener. This value is used by all distance models.
* `SpatialSoundConfig.coneInnerAngle` sets the angle, in degrees, of a cone inside of which there will be no volume reduction.
* `SpatialSoundConfig.coneOuterAngle` sets the angle, in degrees, of a cone outside of which the volume will be reduced by a constant value, defined by the `coneOuterGain` property.
* `SpatialSoundConfig.coneOuterGain` sets the amount of volume reduction outside the cone defined by the `coneOuterAngle` attribute. Its default value is 0, meaning that no sound can be heard. A value between 0 and 1.
* `SpatialSoundConfig.follow` sets this Sound object to automatically track the x/y position of this object. Can be a Phaser Game Object, Vec2 or anything that exposes public x/y properties.
* `WebAudioSoundManager.setListenerPosition` is a new method that allows you to set the position of the Spatial Audio listener.
* `BaseSoundManager.listenerPosition` is a new Vector2 that stores the position of the Spatial Audio listener.
* `WebAudioSound.spatialNode` is a new property that holds the `PanNode` that is used to position the sound in 3D space.
* `WebAudioSound.spatialSource` is a new property that holds a Vector2 that stores the position of the sound in 3D space.
* `WebAudioSound.x` is a new property that sets the x position of the sound in 3D space. This only works if the sound was created with a SpatialSoundConfig object.
* `WebAudioSound.y` is a new property that sets the y position of the sound in 3D space. This only works if the sound was created with a SpatialSoundConfig object.

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
