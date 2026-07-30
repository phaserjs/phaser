# Scenes — Reference

> API reference tables and source file maps for the scenes skill.

## API Quick Reference

### ScenePlugin Methods (`this.scene`)

All methods are queued and execute on the next Scene Manager update, not immediately.

| Method | Signature | Description |
|---|---|---|
| `start` | `(key?, data?) => this` | Stop this scene, start target. No key = restart self. |
| `restart` | `(data?) => this` | Stop and restart this scene |
| `launch` | `(key, data?) => this` | Start another scene in parallel |
| `run` | `(key, data?) => this` | Start/resume/wake another scene (smart) |
| `pause` | `(key?, data?) => this` | Pause scene (no key = this scene) |
| `resume` | `(key?, data?) => this` | Resume paused scene |
| `sleep` | `(key?, data?) => this` | Sleep scene (no update, no render) |
| `wake` | `(key?, data?) => this` | Wake sleeping scene |
| `switch` | `(key, data?) => this` | Sleep this scene, start/wake target |
| `stop` | `(key?, data?) => this` | Shutdown scene (no key = this scene) |
| `transition` | `(config) => boolean` | Animated transition to target scene |
| `get` | `(key) => Scene` | Get a scene reference by key |
| `getStatus` | `(key) => number` | Get scene status constant |
| `getIndex` | `(key?) => number` | Get scene position in scenes array |
| `add` | `(key, sceneConfig, autoStart?, data?) => Scene?` | Add new scene to manager |
| `remove` | `(key?) => this` | Remove and destroy scene |
| `setActive` | `(value, key?, data?) => this` | Set active state (true=resume, false=pause) |
| `setVisible` | `(value, key?) => this` | Set visible state |
| `isActive` | `(key?) => boolean` | Check if scene is running |
| `isPaused` | `(key?) => boolean` | Check if scene is paused |
| `isSleeping` | `(key?) => boolean` | Check if scene is sleeping |
| `isVisible` | `(key?) => boolean` | Check if scene is visible |
| `bringToTop` | `(key?) => this` | Render above all others |
| `sendToBack` | `(key?) => this` | Render below all others |
| `moveUp` | `(key?) => this` | Move one position up in render order |
| `moveDown` | `(key?) => this` | Move one position down in render order |
| `moveAbove` | `(keyA, keyB?) => this` | Move keyB above keyA |
| `moveBelow` | `(keyA, keyB?) => this` | Move keyB below keyA |
| `swapPosition` | `(keyA, keyB?) => this` | Swap positions of two scenes |

### Systems Methods (`this.sys`)

| Method | Returns | Description |
|---|---|---|
| `getData()` | `any` | Get data passed to this scene |
| `getStatus()` | `number` | Current status constant |
| `isActive()` | `boolean` | Is RUNNING? |
| `isPaused()` | `boolean` | Is PAUSED? |
| `isSleeping()` | `boolean` | Is SLEEPING? |
| `isVisible()` | `boolean` | Is visible? |
| `isTransitioning()` | `boolean` | Is transitioning in or out? |
| `isTransitionOut()` | `boolean` | Is transitioning out? |
| `isTransitionIn()` | `boolean` | Is transitioning in? |
| `canInput()` | `boolean` | Can receive input? (status between PENDING and RUNNING) |
| `setActive(value, data?)` | `Systems` | Resume (true) or pause (false) |
| `setVisible(value)` | `Systems` | Set render visibility |
| `pause(data?)` | `Systems` | Pause this scene |
| `resume(data?)` | `Systems` | Resume this scene |
| `sleep(data?)` | `Systems` | Put to sleep |
| `wake(data?)` | `Systems` | Wake from sleep |

## Source File Map

| File | Purpose |
|---|---|
| `src/scene/Scene.js` | Base Scene class with all injected property declarations |
| `src/scene/Systems.js` | Scene systems: lifecycle management, pause/resume/sleep/wake |
| `src/scene/SceneManager.js` | Game-level manager: boots scenes, runs lifecycle, processes queue |
| `src/scene/ScenePlugin.js` | `this.scene` plugin: user-facing API for scene operations |
| `src/scene/Settings.js` | Creates scene settings object from config |
| `src/scene/const.js` | Scene state constants (PENDING=0 through DESTROYED=9) |
| `src/scene/InjectionMap.js` | Maps Systems properties to Scene properties |
| `src/scene/events/index.js` | Event name exports |
| `src/scene/events/*_EVENT.js` | Individual event definitions with JSDoc signatures |
| `src/scene/GetPhysicsPlugins.js` | Resolves physics plugins for a scene |
| `src/scene/GetScenePlugins.js` | Resolves scene plugins |
