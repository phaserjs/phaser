# Phaser 3 Change Log

## Version 3.20.1 - Fitoria - 15th October 2019

### Updates

* The `remove-files-webpack-plugin` plugin has been moved to a devDependency (thanks @noseglid)

### Bug Fixes

* `UpdateList.shutdown` wasn't removing the Scene Update event listener, causing actions to be multiplied on Scene restart (such as animation playback). Fix #4799 (thanks @jronn)
* `Container.mask` wouldn't render in WebGL due to a change in the way child masks were handled. Container masking now works again as in 3.19. Fix #4803 (thanks @paulsymphony)
* `DynamicTilemapLayer.setCollision` would cause an `indexOf` error when trying to access the layer data. Fix #4800 (thanks @PavelMishin)
* `SceneManager.run` (and consequently `ScenePlugin.run`) was using an out-dated way of checking if a Scene was paused before trying to resume it, causing a Scene to be started again instead of resumed. It now uses the `Systems.isPaused` function instead. Fix #3931 (thanks @alexeymolchan)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@xSke
