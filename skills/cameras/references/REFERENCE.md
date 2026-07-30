# Cameras — Reference

> Detailed configuration, API tables, and source file maps for the cameras skill.

## API Quick Reference

### BaseCamera Properties (inherited by Camera)

| Property | Type | Default | Description |
|---|---|---|---|
| `scrollX` / `scrollY` | number | 0 | World position the camera is looking at |
| `zoomX` / `zoomY` | number | 1 | Zoom level per axis |
| `zoom` | number | 1 | Shortcut: sets/gets both zoomX and zoomY |
| `rotation` | number | 0 | Rotation in radians |
| `originX` / `originY` | number | 0.5 | Rotation origin within the viewport (0..1) |
| `x` / `y` | number | 0 | Viewport position on the canvas |
| `width` / `height` | number | game size | Viewport dimensions |
| `worldView` | Rectangle | -- | Read-only rect of visible world area |
| `midPoint` | Vector2 | -- | Read-only center of camera in world coords |
| `alpha` | number | 1 | Opacity of everything rendered by this camera |
| `visible` | boolean | true | Whether the camera renders at all |
| `backgroundColor` | Color | transparent | Background fill color |
| `transparent` | boolean | true | False when backgroundColor has alpha > 0 |
| `roundPixels` | boolean | false | Round positions to integers during render |
| `name` | string | '' | Optional name for lookup |
| `id` | number | bitmask | Assigned by manager for ignore-list filtering |
| `useBounds` | boolean | false | Whether scroll bounds are active |
| `inputEnabled` | boolean | true | Whether objects through this camera receive input |
| `disableCull` | boolean | false | Skip culling before input hit tests |
| `mask` | GeometryMask | null | Canvas-only mask. In WebGL, use filters instead. |
| `forceComposite` | boolean | false | Force framebuffer rendering (WebGL only, v4) |

### BaseCamera Methods

| Method | Signature |
|---|---|
| `setScroll` | `(x, y?)` |
| `setZoom` | `(x?, y?)` |
| `setRotation` | `(radians?)` |
| `setAngle` | `(degrees?)` |
| `setPosition` | `(x, y?)` -- viewport position |
| `setSize` | `(width, height?)` -- viewport size |
| `setViewport` | `(x, y, width, height?)` -- position + size |
| `setOrigin` | `(x?, y?)` -- rotation origin |
| `setBounds` | `(x, y, width, height, centerOn?)` |
| `removeBounds` | `()` |
| `getBounds` | `(out?)` -- returns Rectangle copy |
| `centerOn` | `(x, y)` |
| `centerOnX` | `(x)` |
| `centerOnY` | `(y)` |
| `getScroll` | `(x, y, out?)` -- returns Vector2 |
| `getWorldPoint` | `(x, y, output?)` -- screen to world coords |
| `ignore` | `(entries)` -- GameObject, array, Group, or Layer |
| `setBackgroundColor` | `(color?)` |
| `setAlpha` | `(value?)` |
| `setVisible` | `(value)` |
| `setName` | `(value?)` |
| `setRoundPixels` | `(value)` |
| `setMask` | `(mask, fixedPosition?)` -- Canvas only |
| `clearMask` | `(destroyMask?)` |
| `setForceComposite` | `(value)` -- WebGL only, v4 |

### Camera Methods (extends BaseCamera)

| Method | Signature |
|---|---|
| `startFollow` | `(target, roundPixels?, lerpX?, lerpY?, offsetX?, offsetY?)` |
| `stopFollow` | `()` |
| `setLerp` | `(x?, y?)` |
| `setFollowOffset` | `(x?, y?)` |
| `setDeadzone` | `(width?, height?)` -- omit args to clear |
| `fadeIn` | `(duration?, r?, g?, b?, callback?, context?)` |
| `fadeOut` | `(duration?, r?, g?, b?, callback?, context?)` |
| `fade` | `(duration?, r?, g?, b?, force?, callback?, context?)` |
| `fadeFrom` | `(duration?, r?, g?, b?, force?, callback?, context?)` |
| `flash` | `(duration?, r?, g?, b?, force?, callback?, context?)` |
| `shake` | `(duration?, intensity?, force?, callback?, context?)` |
| `pan` | `(x, y, duration?, ease?, force?, callback?, context?)` |
| `zoomTo` | `(zoom, duration?, ease?, force?, callback?, context?)` |
| `rotateTo` | `(angle, shortestPath?, duration?, ease?, force?, callback?, context?)` |
| `resetFX` | `()` |

### Effect Handler Properties

Each effect is accessible as a property on Camera: `fadeEffect`, `flashEffect`, `shakeEffect`, `panEffect`, `zoomEffect`, `rotateToEffect`. All have `isRunning` (boolean) and `progress` (0..1) properties you can check.

## Gotchas

1. **`this.cameras` is the CameraManager, not an array.** The array of cameras is `this.cameras.cameras`. The main camera is `this.cameras.main`.

2. **Viewport vs Scroll confusion.** `setPosition` / `setViewport` move the camera's rendering rectangle on screen. `setScroll` / `scrollX` / `scrollY` move what the camera is *looking at* in the world. These are independent.

3. **Zoom of 0 will break rendering.** `setZoom(0)` is clamped to 0.001 internally, but avoid passing 0.

4. **Effects do not restart by default.** Calling `cam.fade()` while a fade is running does nothing unless you pass `force: true`. The same applies to flash, shake, pan, zoomTo, and rotateTo.

5. **`startFollow` snaps immediately on first call.** The camera jumps to the target position, then lerps from there. To avoid a visible snap, set scroll to the target position before calling `startFollow`.

6. **Ignore list limit of 32 cameras.** Only the first 32 cameras created get unique bitmask IDs for `ignore()`. Camera 33+ gets ID 0 and cannot use Game Object exclusion.

7. **`roundPixels` and non-integer zoom.** Setting `roundPixels: true` only works correctly when zoom is an integer. Non-integer zoom with `roundPixels` causes jitter.

8. **Camera rotation does not rotate the viewport rectangle.** The viewport is always axis-aligned. Rotation is applied during rendering only.

9. **Masks vs Filters in v4.** `setMask` only works with Canvas renderer (GeometryMask). For WebGL, use `cam.filters.external` (FilterList) instead.

10. **Keyboard controls require manual `update` call.** Both `FixedKeyControl` and `SmoothedKeyControl` must have their `update(delta)` called in your Scene's `update` method -- they do not auto-update.

11. **`pan()` overrides follow.** While a pan effect is running, the follow logic is paused. It resumes after the pan completes.

12. **Camera setViewport caveats.** The viewport is limited to an axis-aligned rectangle, cannot be rotated, and filters/masks may render incorrectly with non-default viewports. For mini-cam effects, consider using `RenderTexture` or `DynamicTexture` instead.

## Source File Map

| File | Description |
|---|---|
| `src/cameras/2d/CameraManager.js` | Scene plugin managing all cameras. Access via `this.cameras`. |
| `src/cameras/2d/BaseCamera.js` | Base class with scroll, zoom, bounds, viewport, ignore, mask, background. |
| `src/cameras/2d/Camera.js` | Extends BaseCamera. Adds effects (fade, flash, shake, pan, zoomTo, rotateTo), follow, deadzone, filters. |
| `src/cameras/2d/effects/Fade.js` | Fade effect implementation. |
| `src/cameras/2d/effects/Flash.js` | Flash effect implementation. |
| `src/cameras/2d/effects/Shake.js` | Shake effect implementation. |
| `src/cameras/2d/effects/Pan.js` | Pan effect implementation. |
| `src/cameras/2d/effects/Zoom.js` | Zoom effect implementation. |
| `src/cameras/2d/effects/RotateTo.js` | RotateTo effect implementation. |
| `src/cameras/2d/events/` | Event constant modules (FADE_IN_START, FLASH_COMPLETE, etc.). |
| `src/cameras/controls/FixedKeyControl.js` | Fixed-speed keyboard camera control. |
| `src/cameras/controls/SmoothedKeyControl.js` | Smoothed (acceleration/drag) keyboard camera control. |
