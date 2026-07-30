# Phaser 3.60.0 Change Log

Return to the [Change Log index](CHANGELOG-v3.60.md).

## TimeStep New Features

* You can now enforce an FPS rate on your game by setting the `fps: { limit: 30 }` value in your game config. In this case, it will set an fps rate of 30. This forces Phaser to not run the game step more than 30 times per second (or whatever value you set) and works for both Request Animation Frame and SetTimeOut.
* `TimeStep._limitRate` is a new internal private property allowing the Timestep to keep track of fps-limited steps.
* `TimeStep.hasFpsLimit` is a new internal boolean so the Timestep knows if the step is fps rate limited, or not.
* There is now a `TimeStep.step` method and `TimeStep.setLimitFPS` method. Which one is called depends on if you have fps limited your game, or not. This switch is made internally, automatically.
* `TimeStep.smoothDelta` is a new method that encapsulates the delta smoothing.
* `TimeStep.updateFPS` is a new method that calculates the moving frame rate average.

## TimeStep Updates

* `TimeStep.wake` will now automatically reset the fps limits and internal update counters.
* `TimeStep.destroy` will now call `RequestAnimationFrame.destroy`, properly cleaning it down.
* `RequestAnimationFrame.step` will now no longer call `requestAnimationFrame` if `isRunning` has been set to `false` (via the `stop` method)
* The `TimeStep` no longer calculates or passes the `interpolation` value to Game.step as it was removed several versions ago, so is redundant.
* The `RequestAnimationFrame.tick` property has been removed as it's no longer used internally.
* The `RequestAnimationFrame.lastTime` property has been removed as it's no longer used internally.
* The `RequestAnimationFrame` class no longer calculates the tick or lastTime values and doesn't call `performance.now` as these values were never used internally and were not used by the receiving callback either.
* The `RequestAnimationFrame.target` property has been renamed to `delay` to better describe what it does.
* The TimeStep would always allocate 1 more entry than the `deltaSmoothingMax` value set in the game config. This is now clamped correctly (thanks @vzhou842)

## TimeStep Bug Fixes

* When forcing a game to use `setTimeout` and then sending the game to sleep, it would accidentally restart by using Request Animation Frame instead (thanks @andymikulski)

## Clock and Timer Event Updates

* The default callback context of the `TimerEvent` has changed to be the `TimerEvent` instance itself, rather than the context (thanks @samme)
* `Time.Clock.startTime` is a new property that stores the time the Clock (and therefore the Scene) was started. This can be useful for comparing against the current time to see how much real world time has elapsed (thanks @samme)

## Clock and Timer Event Bug Fixes

* If you create a repeating or looping `TimerEvent` with a `delay` of zero it will now throw a runtime error as it would lead to an infinite loop. Fix #6225 (thanks @JernejHabjan)
* Timers with very short delays (i.e. 1ms) would only run the callback at the speed of the frame update. It will now try and match the timer rate by iterating the calls per frame. Fix #5863 (thanks @rexrainbow)
* Calling `TimerEvent.reset` in the Timer callback would cause the timer to be added to the Clock's pending removal and insertion lists together, throwing an error. It will now not add to pending removal if the timer was reset. Fix #5887 (thanks @rexrainbow)

---------------------------------------

Return to the [Change Log index](CHANGELOG-v3.60.md).

📖 Read the [Phaser 3 API Docs](https://newdocs.phaser.io/) 💻 Browse 2000+ [Code Examples](https://labs.phaser.io) 🤝 Join the awesome [Phaser Discord](https://discord.gg/phaser)
