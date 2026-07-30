# Version 3.87 - Hanabi - 14th November 2024

## New Features

* `FontFile` is a new File Type loader that allows you to load TTF/OTF fonts directly into Phaser, without the need for a 3rd party web font loader or CSS hacks. The loaded fonts can be used in the Text Game Objects, such as the example below:

```js
preload ()
{
    this.load.font('Caroni', 'assets/fonts/ttf/caroni.otf', 'opentype');
    this.load.font('troika', 'assets/fonts/ttf/troika.otf', 'opentype');
}

create ()
{
    this.add.text(32, 32, 'The face of the moon was in shadow.', { fontFamily: 'troika', fontSize: 80, color: '#ff0000' });
    this.add.text(150, 350, 'Waves flung themselves at the blue evening.', { fontFamily: 'Caroni', fontSize: 64, color: '#5656ee' });
}
```

## Updates

* The Particle Animation State is now optional. A Particle will not create an Animation State controller unless the `anim` property exists within the emitter configuration. By not creating the controller it leads to less memory overhead and a much faster clean-up time when destroying particles. Fix #6482 (thanks @samme)
* Optimized `TweenData.update` to achieve the same result with my less repetition. Also fixes an issue where a Tween that used a custom `ease` callback would glitch when the final value was set, as it would be set outside of the ease callback. It's now passed through it, no matter what. Fix #6939 (thanks @SBCGames)

## Bug Fixes

* Fixed the calculation of the index in `GetBitmapTextSize` that would lead to incorrect indexes vs. the docs and previous releases (thanks @bagyoni)
* `Utils.String.RemoveAt` would incorrectly calculate the slice index if it was > 0. It will now remove the correctly specified character.

## Examples, Documentation, Beta Testing and TypeScript

Thanks to the following for helping with the Phaser Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@Jessime
@drakang4
@BenAfonso
@hatchling13
