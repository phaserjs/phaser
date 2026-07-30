# Phaser 4 Changelog

## Version 4.0.0 - Caladan - 10th April 2026

Phaser v4 is a major release built on a brand-new, highly efficient WebGL renderer. The entire rendering pipeline from Phaser v3 has been replaced with a modern render node architecture that manages WebGL state, supports context restoration, and prioritizes performance. Alongside the new renderer, v4 brings new game objects, a unified filter system replacing both FX and Masks, a rewritten camera system, overhauled tint and shader APIs, a new lighting model, and hundreds of fixes and improvements.

For a step-by-step guide on updating your v3 project, see the [Migration Guide](MIGRATION-GUIDE.md).

---

## Table of Contents

1. [Breaking Changes and Removals](#breaking-changes-and-removals)
    - [Renderer: Pipelines Replaced by Render Nodes](#renderer-pipelines-replaced-by-render-nodes)
    - [Canvas Renderer Deprecated](#canvas-renderer-deprecated)
    - [FX and Masks Unified into Filters](#fx-and-masks-unified-into-filters)
    - [Tint System](#tint-system)
    - [Camera System](#camera-system)
    - [Texture Coordinates and GL Orientation](#texture-coordinates-and-gl-orientation)
    - [DynamicTexture and RenderTexture](#dynamictexture-and-rendertexture)
    - [Shader API](#shader-api)
    - [GLSL Loading](#glsl-loading)
    - [Lighting](#lighting)
    - [TileSprite](#tilesprite)
    - [Graphics and Shape](#graphics-and-shape)
    - [Geometry: Point Replaced by Vector2](#geometry-point-replaced-by-vector2)
    - [Math Constants](#math-constants)
    - [Data Structures](#data-structures)
    - [Removed Mesh Game Object](#removed-mesh-gameobject)
    - [Removed Plugins, Entry Points and Polyfills](#removed-plugins-entry-points-and-polyfills)
    - [Other Breaking Changes](#other-breaking-changes)
2. [New Features](#new-features)
    - [New Game Objects](#new-game-objects)
    - [New Filters](#new-filters)
    - [New Actions](#new-actions)
    - [Lighting](#lighting-features)
    - [Rendering and Shaders](#rendering-and-shaders)
    - [Display and Color](#display-and-color)
    - [Math](#math)
    - [Textures](#textures)
    - [Phaser Compact Texture Atlas](#phaser-compact-texture-atlas)
    - [SpriteGPULayer](#spritegpulayer)
    - [TileSprite Features](#tilesprite-features)
    - [DynamicTexture and RenderTexture Features](#dynamictexture-and-rendertexture-features)
    - [Tilemaps](#tilemaps)
    - [Phaser v3 Enhancements Merged](#phaser-v3-enhancements-merged)
    - [Other New Features](#other-new-features)
3. [Updates and Improvements](#updates-and-improvements)
    - [Rendering and Performance](#rendering-and-performance)
    - [Round Pixels](#round-pixels)
    - [Filters](#filters-improvements)
    - [Camera](#camera)
    - [Input](#input)
    - [Other Updates](#other-updates)
4. [Bug Fixes](#bug-fixes)
    - [Rendering and Filters](#rendering-and-filters)
    - [Camera Fixes](#camera-fixes)
    - [Physics](#physics)
    - [Tilemap Fixes](#tilemap-fixes)
    - [DynamicTexture and RenderTexture Fixes](#dynamictexture-and-rendertexture-fixes)
    - [Game Object Fixes](#game-object-fixes)
    - [Texture Fixes](#texture-fixes)
    - [SpriteGPULayer Fixes](#spritegpulayer-fixes)
    - [Input Fixes](#input-fixes)
    - [Loader and Audio](#loader-and-audio)
    - [Tweens and Timeline](#tweens-and-timeline)
    - [Other Fixes](#other-fixes)
5. [Documentation and TypeScript](#documentation-and-typescript)
6. [Thanks](#thanks)

---

## Breaking Changes and Removals

### Renderer: Pipelines Replaced by Render Nodes

The entire WebGL renderer from Phaser v3 has been replaced. The v3 `Pipeline` system, where individual pipelines frequently held multiple responsibilities and had to manage WebGL state themselves, has been removed. In its place is a new `RenderNode` architecture. Each render node handles a single rendering task, making the system more maintainable and reliable. All render nodes have a `run` method, and some have a `batch` method to assemble state from several sources before invoking `run`.

It is generally not necessary to interact with render nodes directly, but game objects maintain `defaultRenderNodes` and `customRenderNodes` maps for configuration. Use `RenderConfig#renderNodes` to register custom render nodes at boot.

The following internal renderer properties have been removed:

- Remove `WebGLAttribLocationWrapper` as it is unused.
- Remove `WebGLRenderer.textureIndexes` as `glTextureUnits.unitIndices` now fills this role.
- Remove dead code and unused/unconnected properties from `WebGLRenderer`.
- `WebGLRenderer#genericVertexBuffer` and `#genericVertexData` removed.
  - This frees 16MB of RAM and VRAM.
- `BatchHandlerConfig#createOwnVertexBuffer` type property removed.

### Canvas Renderer Deprecated

The Canvas renderer is still available but should be considered deprecated. Canvas rendering does not support any of the WebGL techniques used in Phaser v4's advanced rendering features. Many features from Phaser 3 never worked in Canvas, and almost everything new in Phaser 4 is not available in Canvas. As WebGL support is effectively baseline today, we recommend focusing on WebGL.

Canvas does retain one advantage: a wider range of blend modes (27 modes vs WebGL's 4 native modes of NORMAL, ADD, MULTIPLY and SCREEN). The new `Blend` filter can recreate all of these Canvas blend modes in WebGL, though it requires indirection through a `CaptureFrame`, `DynamicTexture`, or similar.

### FX and Masks Unified into Filters

FX and Masks from Phaser v3 have been unified under a single system called **Filters**. A Filter takes an input image and creates an output image, usually via a single shader program. This ensures all filters are compatible with one another, even if they have no knowledge of each other.

Filters can be applied to **any game object or scene camera**. Phaser 3 had restrictions on which objects supported FX and whether preFX and postFX were available. Phaser 4 removes this restriction entirely. You can even apply filters to `Extern` objects.

Filters are divided into **internal** and **external** lists. Internal filters affect just the object itself. External filters affect the object in its rendering context, usually the full screen. Internal filters are a good way to have filters match the position of the object. Some objects cannot define the internal space (objects without width or height, and `Shape` objects whose stroke may extend beyond reported bounds), so they use the external space instead.

**Removed FX (replaced by Actions or Game Objects):**

The following derived FX from v3 have been removed and replaced:

- `Bloom` FX is now `Phaser.Actions.AddEffectBloom()`, which creates a set of filters applying bloom to a target Camera or GameObject.
- `Shine` FX is now `Phaser.Actions.AddEffectShine()`, which creates a Gradient and blends a shine across the target.
- `Circle` FX is now a case of `Phaser.Actions.AddMaskShape()`, which creates a Shape and uses it to add a mask.
- `Gradient` FX is replaced by the new `Gradient` game object, as it replaces the image entirely rather than altering it.

**Removed masking classes:**

- `BitmapMask` has been removed. It was only used in WebGL, which now has the `Mask` filter for more powerful masking operations.
- `GeometryMask` remains available in the Canvas renderer but is not used in WebGL.

**ColorMatrix filter change:**

The existing `ColorMatrix` filter shifted its color management methods onto a `colorMatrix` property. For example, you now call `colorMatrix.colorMatrix.sepia()` instead of `colorMatrix.sepia()`.

### Tint System

The tint API has been overhauled with a new mode-based system and additional blend modes.

- `Tint` is overhauled.
  - `tint` and `setTint()` now purely affect the color settings.
    - Previously, both would silently deactivate fill mode.
  - `tintFill` and `setTintFill()` are removed.
  - New property `tintMode` and new method `setTintMode()` now set the tint fill mode.
  - `Phaser.TintModes` enumerates valid tint modes.
    - `MULTIPLY`
    - `FILL`
    - `ADD`
    - `SCREEN`
    - `OVERLAY`
    - `HARD_LIGHT`
  - FILL mode now treats partial alpha correctly.
  - BitmapText tinting now works correctly.
  - Conversion tip: `foo.setTintFill(color)` becomes `foo.setTint(color).setTintMode(Phaser.TintModes.FILL)`.

### Camera System

The camera matrix system has been rewritten. If you only use standard camera properties (`scrollX`, `scrollY`, `zoom`, `rotation`), your code should work without changes. If you access camera matrices directly, you must update your code.

- `Camera#matrix` now includes scroll, and excludes position.
- `Camera#matrixExternal` is a new matrix, which includes the position.
- `Camera#matrixCombined` is the multiplication of `matrix` and `matrixExternal`. This is sometimes relevant.
- The `GetCalcMatrix(src, camera, parentMatrix, ignoreCameraPosition)` method now takes `ignoreCameraPosition`, causing its return value to use the identity matrix instead of the camera's position.
- `GetCalcMatrixResults` now includes a `matrixExternal` property, and factors scroll into the `camera` and `calc` matrices.
- To get a copy of a matrix with scroll factor applied, use `TransformMatrix#copyWithScrollFactorFrom(matrix, scrollX, scrollY, scrollFactorX, scrollFactorY)`. This generally replaces cases where phrases such as `spriteMatrix.e -= camera.scrollX * src.scrollFactorX` were used.

### Texture Coordinates and GL Orientation

Phaser v3 represented textures using top-left orientation, which led to mismatches: framebuffers would be drawn upside-down, then flipped to draw to the screen. Phaser v4 has switched to using GL orientation throughout. This is largely invisible to the user as Phaser handles texture coordinate translation automatically, but some shader code may need to be revised as top and bottom may have switched.

Texture coordinates now match WebGL standards. This should bring greater compatibility with other technologies. Note that compressed textures must be re-compressed to work with this system: ensure that the Y axis starts at the bottom and increases upwards.

### DynamicTexture and RenderTexture

In Phaser v3, `DynamicTexture` allowed you to define batches and perform intricate drawing operations directly. While efficient, this was too technical for most uses and it used its own drawing logic, creating compatibility issues. In Phaser v4, many of these complex methods have been removed. Instead, the basic rendering system is used, which supports batching automatically.

- `DynamicTexture` and `RenderTexture` must call `render()` to actually draw.

### Shader API

The `Shader` game object has been significantly rewritten for Phaser v4. Existing Shader objects from v3 will need to be updated.

- The game object construction signature has changed. It now takes a config object (`ShaderQuadConfig`) which allows you to configure the way the shader executes.
- Shaders formerly set a number of shader uniforms in line with websites like Shadertoy. These uniforms are no longer set automatically. You can encode them into your configuration if you need them.
- Note that the texture coordinates of your shader will now use GL conventions, where Y=0 is at the bottom of the image.

### GLSL Loading

The way Phaser loads GLSL code has changed:

- GLSL code is now loaded without regard to how it will be used. It is not classified as fragment or vertex code, because under the new system it could be either, or both. You load fragment and vertex shaders separately and combine them when creating a Shader.
- Custom templates have been removed from shader code. Phaser now uses `#pragma` preprocessor directives, which are valid GLSL and work with automated syntax checkers. The pragmas are removed before compilation and serve merely as identifiers for custom templates.

### Lighting

In Phaser v3, lighting was added to objects by assigning a new pipeline. In Phaser v4, simply call `gameObject.setLighting(true)`. You don't need to worry about how lighting is applied internally.

In Phaser v3, lights had an implicit height based on the game resolution. In Phaser v4, lights have a `z` value to set height explicitly.

Note that lighting changes the shader, which breaks batches.

### TileSprite

In Phaser v3, `TileSprite` used WebGL texture wrapping parameters to repeat the texture. This approach only repeated the entire texture file and had problems with compressed textures, non-power-of-two textures, and DynamicTextures.

In Phaser v4, `TileSprite` uses a different shader that manually controls texture coordinate wrapping. This now supports any texture and can use frames within that texture, enabling texture atlas and spritesheet support.

- `TileSprite` no longer supports texture cropping.
- TileSprite now assigns default dimensions to each dimension separately.

### Graphics and Shape

- `Grid` has changed property names to follow the conventions of other Shapes: it has a **stroke** instead of an **outline**. Grid also has controls for how to render the gutters between grid cells, and whether to draw outlines on the outside of the grid or just between cells.
- Remove references to Mesh.

### Geometry: Point Replaced by Vector2

The `Geom.Point` class and all related functions have been removed. All functionality can be found in the existing `Vector2` math classes. All Geometry classes that previously created and returned `Point` objects now return `Vector2` objects instead.

**Method mapping:**

| Removed | Replacement |
|---|---|
| `Point.Ceil` | `Vector2.ceil` |
| `Point.Floor` | `Vector2.floor` |
| `Point.Clone` | `Vector2.clone` |
| `Point.CopyFrom(src, dest)` | `dest.copy(src)` |
| `Point.Equals` | `Vector2.equals` |
| `Point.GetCentroid` | `Math.GetCentroid` |
| `Point.GetMagnitude` | `Vector2.length` |
| `Point.GetMagnitudeSq` | `Vector2.lengthSq` |
| `Point.Invert` | `Vector2.invert` |
| `Point.Negative` | `Vector2.negate` |
| `Point.SetMagnitude` | `Vector2.setLength` |
| `Point.Project` | `Vector2.project` |
| `Point.ProjectUnit` | `Vector2.projectUnit` |
| `Point.Interpolate` | `Math.LinearXY` |
| `Point.GetRectangleFromPoints` | `Math.GetVec2Bounds` |

**New Vector2 and Math methods:**

* `Vector2.ceil` is a new method that will apply Math.ceil to the x and y components of the vector. Use as a replacement for `Geom.Point.Ceil`.
* `Vector2.floor` is a new method that will apply Math.floor to the x and y components of the vector. Use as a replacement for `Geom.Point.Floor`.
* `Vector2.invert` is a new method that will swap the x and y components of the vector. Use as a replacement for `Geom.Point.Invert`.
* `Vector2.projectUnit` is a new method that will calculate the vector projection onto a non-zero target vector. Use as a replacement for `Geom.Point.ProjectUnit`.
* `Math.GetCentroid` is a new function that will get the centroid, or geometric center, of a plane figure from an array of Vector2 like objects. Use as a replacement for `Geom.Point.GetCentroid`.
* `Math.GetVec2Bounds` is a new function that will get the AABB bounds as a Geom.Rectangle from an array of Vector2 objects. Use as a replacement for `Geom.Point.GetRectangleFromPoints`.

**Geometry classes updated to return Vector2:**

* `Geom.Circle.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Circle.CircumferencePoint`, `Circle.CircumferencePoint`, `Circle.GetPoint`, `Circle.GetPoints`, `Circle.OffsetPoint` and `Circle.Random` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Ellipse.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Ellipse.CircumferencePoint`, `Ellipse.CircumferencePoint`, `Ellipse.GetPoint`, `Ellipse.GetPoints`, `Ellipse.OffsetPoint` and `Ellipse.Random` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Line.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Line.GetEasedPoint`, `Line.GetMidPoint`, `Line.GetNearestPoint`, `Line.GetNormal`, `Line.GetPoint`, `Line.GetPoints`, `Line.Random` and `Line.RotateAroundPoint` all now take and in some cases return Vector2 instances instead of Point objects.
* The `Geom.Polygon.getPoints` method now returns Vector2 objects instead of Point.
* The functions `Geom.Polygon.ContainsPoint` and `Polygon.GetPoints` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Rectangle.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Rectangle.ContainsPoint`, `Rectangle.GetCenter`, `Rectangle.GetPoint`, `Rectangle.GetPoints`, `Rectangle.GetSize`, `Rectangle.MarchingAnts`, `Rectangle.MergePoints`, `Rectangle.OffsetPoint`, `Rectangle.PerimeterPoint`, `Rectangle.Random` and `Rectangle.RandomOutside` all now take and in some cases return Vector2 instances instead of Point objects.
* `Geom.Triangle.getPoint`, `getPoints` and `getRandomPoint` now all return Vector2 objects instead of Point.
* The functions `Geom.Triangle.Centroid`, `Triangle.CircumCenter`, `Triangle.ContainsArray`, `Triangle.ContainsPoint`, `Triangle.GetPoint`, `Triangle.GetPoints`, `Triangle.InCenter`, `Triangle.Random` and `Triangle.RotateAroundPoint` all now take and in some cases return Vector2 instances instead of Point objects.

### Math Constants

* `Math.TAU` is now actually the value of tau! (i.e. PI * 2) instead of being PI / 2.
* `Math.PI2` has been removed. You can use `Math.TAU` instead. All internal use of PI2 has been replaced with TAU.
* `Math.PI_OVER_2` is a new constant for PI / 2 and all internal use of TAU has been updated to this new constant.

### Data Structures

- `Phaser.Struct.Set` has been replaced with a native JavaScript `Set`. Methods like `iterateLocal` are gone. Use standard `Set` methods instead.
- `Phaser.Struct.Map` has been replaced with a native JavaScript `Map`. Methods like `contains` and `setAll` are gone. Use standard `Map` methods instead.

### Removed Mesh Game Object

We have removed the ability for Phaser v4 to load Wavefront OBJ files and render them via the very limited Mesh Game Object. Proper 3D support is planned for the future. As a result, the following has been removed:

- The `Mesh` Game Object.
- The `Plane` Game Object.
- The `OBJ` File Type Loader.
- All Mesh related geometry files, previously in the `geom/mesh` folder, including: `Face`, `GenerateGridVerts`, `GenerateObjVerts`, `ParseObj`, `ParseObjMaterial`, `RotateFace` and `Vertex`.
- The `obj` global BaseCache entry.

### Removed Plugins, Entry Points and Polyfills

The following have been removed entirely:

- The `phaser-ie9.js` entry point.
- The Camera3D Plugin.
- The Layer3D Plugin.
- The Facebook Plugin detection constants.
- The `Create.GenerateTexture` function and all Create Palettes and the `create` folder.
- `TextureManager.generate` (as a result of the GenerateTexture removal).
- `Math.SinCosTableGenerator`.
- The following polyfills: Array.forEach, Array.isArray, AudioContextMonkeyPatch, console, Math.trunc, performance.now, requestAnimationFrame and Uint32Array.
- The Spine 3 and Spine 4 plugins will no longer be updated. You should now use the official Phaser Spine plugin created by Esoteric Software.

### Other Breaking Changes

- `Shader#setTextures()` now replaces the texture array, rather than adding to it.
- Eliminate rounding in `Camera#preRender()`.
- Remove `TransformMatrix#setQuad` parameter `roundPixels`, as it is no longer used.
- Remove unnecessary transform related to camera scroll.

---

## New Features

### New Game Objects

All new game objects are WebGL-only unless otherwise noted.

- `GameObjects.Gradient` is a new game object which renders gradients.
  - Gradient shapes include:
    - `LINEAR`
    - `BILINEAR`
    - `RADIAL`
    - `CONIC_SYMMETRIC`
    - `CONIC_ASYMMETRIC`
  - Gradient repeat modes include:
    - `EXTEND`: flat colors extend from start and end.
    - `TRUNCATE`: transparency extends from start and end.
    - `SAWTOOTH`: gradient starts over every time it completes.
    - `TRIANGULAR`: gradient reverses direction every time it gets to the end or start.
  - Optional Interleaved Gradient Noise based dithering to eliminate banding.
  - Colors are defined in a `ColorRamp` containing `ColorBand` objects. Every number between 0 and 1 corresponds to a precise color from the gradient ramp, accessible through code.
- `GameObjects.Noise` renders noise patterns.
  - Control value power curve.
  - Select from trigonometric or PCG algorithms.
  - Output grayscale, random color, or random normals.
- Cellular noise objects: `GameObjects.NoiseCell2D`, `NoiseCell3D` and `NoiseCell4D` provide cellular/Worley/Voronoi noise.
  - Render cellular noise with sharp or smooth edges, or random flat colors.
  - Smoothly animate scroll through the XY plane or evolve the pattern through Z or ZW axes.
  - Add octaves of detail.
  - Supports rendering as a texture or normal map for use in other effects.
- Simplex noise objects: `GameObjects.NoiseSimplex2D` and `NoiseSimplex3D` provide simplex noise.
  - Render simplex noise, the successor to Perlin Noise.
  - Use gradient flow to smoothly loop noise animation.
  - Add octaves of detail.
  - Apply turbulence and output shaping for a variety of effects.
  - Supports rendering as a texture or normal map for use in other effects.
- `GameObjects.NineSlice` has two new parameters: `tileX`, `tileY`, which allow non-corner regions of the NineSlice to tile instead of stretch. Some stretching is still applied to keep the tile count a whole number. Thanks to @skhoroshavin for this contribution!
- `GameObjects.SpriteGPULayer` is a new high-performance game object optimized for rendering very large numbers of quads. It is suited to complex animated backgrounds and particle-like effects. It stores rendering data in a GPU buffer and renders all members in a single draw call. Because it only updates the GPU buffer when necessary, it is up to 100 times faster than rendering the same objects individually. The layer can generally perform well with a million small quads. See the dedicated [SpriteGPULayer](#spritegpulayer) section below for full details.
- `GameObjects.TilemapGPULayer` is a new high-performance tilemap renderer. It renders an entire tilemap layer as a single quad via a specialized shader, with a fixed cost per pixel on screen regardless of how many tiles are visible. See the dedicated [TilemapGPULayer](#tilemapgpulayer) section below for full details.
- `GameObjects.Stamp` renders a quad without any reference to the camera. This is mostly used for `DynamicTexture` operations. Available in both WebGL and Canvas.
- Add `CaptureFrame` game object, which copies the current framebuffer to a texture when it renders. This is useful for applying post-processing prior to post.
- `GameObject#isDestroyed` flag helps you avoid errors when accessing an object that might have removed expected properties during destruction.

### New Filters

Filters can be applied to any game object or scene camera.

- `Blend` filter combines the input with a texture. This is similar to blend modes, but supports all the blend modes available in the Canvas renderer (not just WebGL's 4 native modes). Also supports overdriving, mixing outside the usual 0-1 range, for useful color effects.
- `Blocky` filter added. This is similar to Pixelate, but it picks just a single color from the image, preserving the palette of pixel art. You can also configure the pixel width and height, and offset. This is a good option for pixelating a retro game at high resolution, setting up for additional filters such as CRT emulation.
- `CombineColorMatrix` filter for remixing alpha and other channels between images.
- `GradientMap` filter for recoloring images using a gradient and their own brightness.
- `ImageLight` filter for image-based lighting, a soft, highly realistic form of illumination. Supports 360 degree panoramas for realistic reflections, or simpler gradients and images for the impression of a natural scene.
- `Key` filter for removing or isolating colors.
- `Mask` filter takes the place of masks from Phaser 3. It can take a texture, or a game object which it draws to a DynamicTexture. A Container with other objects, even objects with their own filters and masks, is a valid mask source. Supports `scaleFactor` parameter for creating scaled-down framebuffers to save memory in large games. Thanks to kimdanielarthur-cowlabs for developing the initial solution.
- `NormalTools` filter for manipulating normal maps. Supports rotation, squishing, and "ratio" output measuring how closely the surface faces the viewpoint.
- `PanoramaBlur` filter for adjusting images for `ImageLight`. Runs in spherical space to average out 360 degree panorama files for diffuse environment maps.
- `Parallel Filters` filter passes the input image through two different filter lists and combines them at the end. Useful when you want some memory in a complex stack of filters.
- `Quantize` filter for reducing colors and dithering. Implements dithering with Interleaved Gradient Noise for excellent quality even with very few colors.
- `Sampler` filter extracts data from the WebGL texture and sends it back to the CPU for use in a callback. Similar to the snapshot functions available on DynamicTexture.
- `Threshold` filter applies a soft or hard threshold to the colors in the image.
- `Vignette` filter returns from Phaser 3.
  - Now sets a configurable border color instead of erasing alpha.
  - Also supports limited blend modes.
- `Wipe` filter returns from Phaser 3.
  - Now allows you to set the texture displayed in wiped-away regions.
  - Now provides helper functions to set directional reveal/wipe effects.
- Add Filter support to `Layer`.
- Add chainable setter methods to `Filter` component: `setFiltersAutoFocus`, `setFiltersFocusContext`, `setFiltersForceComposite`, `setRenderFilters`.

### New Actions

- `Actions.AddEffectBloom` allows you to quickly set up a bloom effect, using several filters, on a target Camera or GameObject.
- `Actions.AddEffectShine` allows you to quickly set up a shine effect, using a new Gradient and filters, on a target Camera or GameObject.
- `Actions.AddMaskShape` allows you to quickly add shapes to a target Camera or GameObject as Masks. Blurred edges and inversion are supported.
- `Actions.FitToRegion` transforms an object to fit a region, such as the screen.

### Lighting

- Lighting is now enabled via `gameObject.setLighting(true)` instead of assigning a pipeline.
- Lighting is available on many game objects, including BitmapText, Blitter, Graphics and Shape, Image and Sprite, Particles, SpriteGPULayer, Stamp, Text, TileSprite, Video, and TilemapLayer and TilemapGPULayer.
- Objects can now cast "self-shadows", using a more realistic shader that simulates shadows cast by features on their own surface, based on the brightness of the texture. Self-shadows can be enabled as a game-wide setting or per-object.
- Lights now have a `z` value to set height explicitly, replacing the implicit height based on game resolution from Phaser v3.

### Rendering and Shaders

- `WebGLSnapshot` (used in snapshot functions) supports unpremultiplication, which is on by default. This removes dark fringes on text and objects with alpha.
- `RenderConfig#renderNodes` allows you to add render nodes at game boot.
- `ShaderQuadConfig#initialUniforms` lets you initialize a Shader with uniforms on creation.
- `Shader#setUniform(name, value)` lets you set shader program uniforms just once, instead of putting them all into the `setupUniforms()` method, where some uniforms might be set redundantly after init. This wraps `Shader#renderNode.programManager.setUniform`.
- `BatchHandlerQuadSingle` render node added.
  - This is just a copy of `BatchHandlerQuad` with space for 1 quad.
  - The rendering system uses this node internally for transferring images in some steps of the filter process.
- `Camera` has the new property `isObjectInversion`, used internally to support special transforms for filters.
- `Shader` has the new method `renderImmediate`, which makes it straightforward to use `renderToTexture` when the object is not part of a display list, or otherwise needs updating outside the regular render loop.
- Extend `RenderWebGLStep` to take the currently rendering object list and index as parameters. This allows render methods to know their context in the display list, which can be useful for optimizing third-party renderers.
  - This takes the place of `nextTypeMatch` from Phaser v3, but is much more flexible.
- `GameObject#vertexRoundMode` added to control vertex pixel rounding on a per-object basis.
  - Options include:
    - `"off"`: Never round vertex positions.
    - `"safe"`: Round vertex positions if the object is "safe": it is rendering with a transform matrix which only affects the position, not other properties such as scale or rotation.
    - `"safeAuto"` (default): Like "safe", but only if rendering through a camera where `roundPixels` is enabled.
    - `"full"`: Always round vertex positions. This can cause sprites to wobble if their vertices are not safely aligned with the pixel resolution, e.g. during rotations. This is good for a touch of PlayStation 1 style jank.
    - `"fullAuto"`: Like "full", but only if rendering through a camera where `roundPixels` is enabled.
  - `GameObject#willRoundVertices(camera, onlyTranslated)` returns whether vertices should be rounded. In the unlikely event that you need to control vertex rounding even more precisely, you are intended to override this method.
- Phaser v4 now uses GL element drawing with index buffers, meaning each quad only needs 4 vertices uploaded instead of 6 (two thirds of the v3 vertex data cost).
- The `smoothPixelArt` config option supports antialiasing while preserving sharp texels when scaled up. This is usually the correct choice for retro graphics with big pixels that need to rotate or scale smoothly.

### Display and Color

- `Display.Color`: several helper methods now support modifying an existing `Color` object instead of creating a new one.
  - `HSLToColor`
  - `HexStringToColor`
  - `IntegerToColor`
  - `ObjectToColor`
  - `RGBStringToColor`
  - `ValueToColor`
- `Display.Color.Interpolate`: an extra interpolation mode is available.
  - `HSVWithHSV`: new method to interpolate HSV values, in HSV space.
  - `ColorWithColor` has new parameters to allow it to operate in HSV space.
    - `hsv` flag sets it to operate in HSV space.
    - `hsvSign` flag can force it to interpolate hue either ascending or descending. Default behavior picks the shortest angle.
- `Display.ColorBand` describes a transition between two colors. Intended for use in gradients.
- `Display.ColorRamp` describes a range of colors using ColorBands. Intended for use in gradients.

### Math

- `Math.Hash` provides fast hashes of 1, 2, 3, or 4 dimensional input, using trigonometric or PCG methods.
- `Math.HashCell` provides hashes of 1, 2, 3, or 4 dimensional input, using hash results in a Worley noise field. This produces a continuous but lumpy field.
- `Math.HashSimplex` provides hashes of 1, 2, or 3 dimensional input, using a simplex noise implementation. This produces a continuous, smooth field.

### Textures

- `Texture#setWrap()` provides easy access to texture wrap mode in WebGL, which would otherwise be very technical to alter on `WebGLTextureWrapper` objects. This is probably of most use to shader authors. Thanks @Legend-Master for raising an issue where power-of-two sprites had unexpected wrapping artifacts.
- `Phaser.Textures.WrapMode.CLAMP_TO_EDGE` is always available.
- `Phaser.Textures.WrapMode.REPEAT` will only be applied to textures with width and height equal to powers of 2.
- `Phaser.Textures.WrapMode.MIRRORED_REPEAT` likewise requires powers of 2.
- `Texture#setSource` method for updating the source of a texture. Note that, while the source will update, derived values such as object sizes will not. It's advisable to switch between textures of identical size to avoid unexpected transforms.
- `Texture#setDataSource` method already existed, but has been changed to be more useful like `setSource`.
- `TextureManager#addFlatColor` method for creating a flat texture with custom color, alpha, width, and height. This is intended to act as a temporary stand-in for textures you might not have loaded yet.
- `TextureSource#updateSource` method for switching sources directly.
- New `Phaser.Types.Textures.TextureSource` and `Phaser.Types.Textures.TextureSourceElement` types to simplify the increasing number of sources for a texture.

### Phaser Compact Texture Atlas

Phaser v4 introduces a new texture atlas format called the **Phaser Compact Texture (PCT)** atlas. It is a line-oriented text descriptor designed as a drop-in replacement for verbose JSON or XML based atlas files, while remaining trivially parsable at runtime. A single `.pct` file can describe one or many atlas pages and is supported throughout the Loader, Texture Manager, and Atlas Cache.

**Why use it:** PCT files are typically **90-95% smaller** than equivalent JSON atlas descriptors. For an atlas with hundreds of frames this can mean a multi-kilobyte JSON file collapsing to a few hundred bytes of plain text — important for fast cold-start loads, mobile data budgets, and games with many atlases.

**How to create PCT files:** A free on-line texture packer tool will be available on the Phaser website at https://phaser.io/tools/ or you can feed the specification file to your favorite AI agent and have it create one.

**How it works:** A `.pct` file is plain UTF-8 text. Each line is a record identified by a short prefix (`PCT:`, `P:`, `F:`, `#`, `B:`, `A:`, or an individual frame line). The format includes:

- **Block grouping** — runs of same-sized sprites packed in a grid are stored as a single `B:` record plus one names line, instead of one record per frame.
- **Range compression** — sequential frame names like `walk_01` through `walk_24` collapse to `walk_#01-24`.
- **Folder dictionary** — repeated folder paths are interned in a small `F:` table and referenced by index.
- **Extension dictionary** — common extensions (`.png`, `.webp`, `.jpg`, `.jpeg`, `.gif`) are encoded as a single trailing digit.
- **Aliases** — pixel-identical duplicate frames detected at packing time share a single atlas region via `A:` records.
- **Multi-page atlases** — a single `.pct` file can declare multiple texture pages and route frames to the correct one with `#N` page selectors.

The format is versioned (`PCT:1.0`) using `major.minor` semver-style numbering, so future minor revisions can add features without breaking older parsers.

**How to use it:** Load a PCT atlas exactly the same way you would load any other Phaser asset, using the new `LoaderPlugin#atlasPCT` method:

```javascript
function preload ()
{
    this.load.atlasPCT('level1', 'images/Level1.pct', 'images');
}

function create ()
{
    this.add.image(x, y, 'level1', 'warrior/idle_01.png');

    //  The decoded structure is also available from the Atlas Cache
    var data = this.cache.atlas.get('level1');
}
```

The Loader reads the `.pct` file, decodes it, queues each referenced texture page as a separate image, and once everything has loaded, assembles a single multi-source `Texture` in the Texture Manager. The decoded `{ pages, folders, frames }` object is also stored in a new `Phaser.Cache.CacheManager#atlas` cache so you can inspect the page and folder metadata at runtime.

**Specification:** A complete description of the format — record types, decoding algorithm, helper functions, and worked examples — lives at `docs/Phaser Compact Texture Atlas Format Specification/Phaser Compact Texture Atlas Format Specification.md`. Anyone wanting to write a PCT exporter for a different tool can implement the loader directly from that document.

**API surface:**

- New `LoaderPlugin#atlasPCT(key, url)` method registered via `FileTypesManager`. Accepts a string key and URL, an array of file definitions, or a config object with `key`, `atlasURL`, `path`, `baseURL`, and `xhrSettings`.
- New `Phaser.Loader.FileTypes.PCTAtlasFile` MultiFile class which loads the `.pct` data file, dynamically queues an `ImageFile` for each page declared inside it, and adds the assembled atlas to the Texture Manager when all of its children are loaded.
- New `Phaser.Textures.TextureManager#addAtlasPCT(key, source, data, dataSource)` method for adding a decoded PCT atlas to a Texture. The existing `addAtlas` method now auto-detects PCT data by shape and dispatches to it, alongside the existing JSON Array and JSON Hash dispatch.
- New `Phaser.Textures.Parsers.PCT(texture, decoded)` parser which iterates the decoded frames and creates `Frame` instances on the matching `TextureSource`, including trim and rotation handling. The PCT page and folder metadata is copied onto `Texture#customData.pct` for later inspection.
- New `Phaser.Textures.Parsers.PCTDecode(text)` standalone helper which converts raw PCT text into the structured `{ pages, folders, frames }` object, validates the version header, and is safe to call directly if you have PCT text from a non-Loader source.
- New `Phaser.Cache.CacheManager#atlas` BaseCache instance, used to store decoded PCT data alongside its texture entry in the Texture Manager. Accessible from a Scene as `this.cache.atlas`.

### SpriteGPULayer

`SpriteGPULayer` is a new WebGL-only game object optimized for rendering very large numbers of quads following simple tween-style animations. It is suited to complex animated backgrounds, particle-like effects, and any scenario where you need to render far more sprites than the standard rendering path allows.

**How it works:** SpriteGPULayer stores rendering data for all its member quads in a GPU buffer and renders them in a single draw call. Because it only updates the GPU buffer when the data actually changes, it is up to **100 times faster** than rendering the same objects individually. Standard Phaser rendering can handle tens of thousands of sprites with good performance; SpriteGPULayer can handle **a million or more**.

**Why it's fast:** Regular sprites compute their properties on the CPU every frame and upload the results to the GPU -- that per-frame upload is the main performance bottleneck. SpriteGPULayer skips this entirely by keeping a static buffer on the GPU. The trade-off is memory (168 bytes per member on both CPU and GPU) and reduced flexibility for runtime changes.

**Member capabilities:** Each member in the layer supports:

- **Position, rotation, scale, and alpha** -- each of which can be individually animated with a rich set of GPU-driven easing functions.
- **Per-member scroll factor** for parallax backgrounds.
- **Frame animation** -- cycling through texture frames automatically on the GPU without CPU involvement.
- **Per-vertex tinting** with animated tint blend and all v4 tint modes.
- **Per-member origin** for pivot control.
- **Creation time** for staggering animations across members.
- **Non-looping animations** (set `loop: false`) for one-off particle effects and dynamic sources.

**Animation easing:** Members support a comprehensive set of GPU-computed easing functions: Linear, Gravity, Quad, Cubic, Quart, Quint, Sine, Expo, Circ, Back, Bounce, Stepped, and Smoothstep -- each with easeIn, easeOut, and easeInOut variants. Animations support yoyo and delay. The Gravity ease mode provides physics-style acceleration with configurable velocity and gravity factor.

**Texture requirements:** SpriteGPULayer uses a single texture image (not a multi-atlas). For pixel art or round pixels, use a power-of-two texture to avoid seaming. For smooth mode, add padding around each frame. Single-image textures or textures where frames don't need to tile are unaffected.

**Populating efficiently:** Rather than creating a new `SpriteGPULayer.Member` config object for each `addMember` call, you should reuse the same object and edit its properties between calls. Creating millions of JavaScript objects has a significant allocation and garbage collection cost, so reusing a single config can reduce initialization time from tens of seconds to under a second.

**Modifying the layer:** The following operations require buffer updates and are expensive: `addData`, `addMember`, `editMember`, `patchMember`, `resize`, `removeMembers`, `insertMembers`, `insertMembersData`. The buffer is split into segments so that edits to a small region only update the affected segment. If you need to "remove" a member without costly buffer splicing, set its `scaleX`, `scaleY`, and `alpha` to 0 instead -- it will still be rendered but will fill no pixels.

**API surface:**

- `addMember(member)` -- Add a member to the layer. This is the easiest way to populate it.
- `addData(data)` -- Add raw Float32Array data to the buffer for maximum efficiency.
- `editMember(index, member)` -- Replace a member's data at a given index.
- `patchMember(index, data, mask)` -- Update specific properties of a member using raw data and an optional mask.
- `getMember(index)` -- Get a copy of a member's data as a readable object.
- `getMemberData(index, out)` -- Get the raw Uint32Array data of a member for efficient editing.
- `insertMembers(index, members)` -- Insert one or more members at a specific position.
- `insertMembersData(index, data)` -- Insert raw data at a specific position.
- `removeMembers(index, count)` -- Remove members from the layer (causes full buffer update).
- `resize(count, clear)` -- Resize the layer buffer.
- `setAnimations(animations)` -- Define frame animations available to members.
- `setAnimationEnabled(name, enabled)` -- Enable or disable an easing function in the shader. Every enabled animation has a shader cost; low-end devices may be unable to compile many simultaneously.
- `getDataByteSize()` -- Get the byte stride per member for direct buffer manipulation.
- Add documentation explaining how to modify a `SpriteGPULayer` efficiently.
- Add `SpriteGPULayer#insertMembers` method.
- Add `SpriteGPULayer#insertMembersData` method.
- Add `SpriteGPULayer#getDataByteSize` method.
- Add non-looping animations to `SpriteGPULayer` (set animation to `loop: false`) to support one-time particle effects and dynamic sources.
- Add creation time to `SpriteGPULayer` members.

### TilemapGPULayer

`TilemapGPULayer` is a new WebGL-only tilemap renderer that renders an entire tilemap layer as a single quad via a specialized shader. It is optimized for speed and visual quality over flexibility.

**How it works:** The layer encodes its tile data and any tile animations into GPU textures, then renders the full layer in a single draw call. Because the shader has knowledge of the full layer, it can accurately blend across tile boundaries, producing **perfect texture filtering with no seams or bleeding** when antialiasing is enabled -- something a regular `TilemapLayer` cannot achieve. In LINEAR filter mode, borders between tiles are rendered smoothly. In NEAREST mode, sharp pixel edges are preserved.

**Performance:** The rendering cost is fixed per pixel on screen, regardless of how many tiles are visible. It suffers no performance loss when many tiles are visible. It can render a layer up to **4096 x 4096 tiles** and will render the entire layer just as quickly if the camera zooms out to see all 16 million tiles. This makes it a superior choice when large numbers of tiles need to be on screen at once, particularly on mobile platforms. It is almost entirely GPU-bound, freeing up CPU resources for other game code.

**How to create one:** Add the `gpu` flag to a call to `Tilemap.createLayer()`. This returns a `TilemapGPULayer` instance instead of a regular `TilemapLayer`.

**Capabilities and restrictions:**

- Uses a single tileset with a single texture image.
- Maximum tilemap size of 4096 x 4096 tiles.
- Maximum of 2^23 (8,388,608) unique tile IDs.
- Tiles may be flipped and animated.
- Animation data limit of 8,388,608 entries.
- **Orthographic tilemaps only** -- not suitable for isometric or hexagonal maps.

**Editing:** The layer can be edited after creation, but changes do not apply automatically. Call `generateLayerDataTexture()` to regenerate the tile data texture after making edits.

- `TilemapLayer` and `TilemapGPULayer` now support a parent matrix during rendering.

### TileSprite Features

TileSprite now uses a new shader that manually controls texture coordinate wrapping, replacing the old approach of relying on WebGL texture wrapping parameters. This enables several new capabilities:

- TileSprite now supports texture frames within atlases and spritesheets.
- The `tileRotation` property allows you to rotate the repeating texture.
- The `repeat()` method on DynamicTexture now uses TileSprite behind the scenes, extending its capabilities.

### DynamicTexture and RenderTexture Features

- Allow `RenderTexture` to automatically re-render.
  - `DynamicTexture#preserve()` allows you to keep the command buffer for reuse after rendering.
  - `DynamicTexture#callback()` allows you to run callbacks during command buffer execution.
  - `RenderTexture.setRenderMode()` allows you to set the RenderTexture to automatically re-render during the render loop.
- `RenderTexture` has a new `renderMode` property. When set to `"render"`, it draws like an ordinary Image. When set to `"redraw"`, it runs `render()` to update its texture during the render loop but does not draw itself. When set to `"all"`, it does both. The `"redraw"` mode allows updating a texture during the render loop, enabling you to draw things that have only just updated, such as same-frame shader outputs.
- Add `DynamicTexture#capture`, for rendering game objects more accurately and with greater control than `draw`.
- `TextureManager#addDynamicTexture` now has `forceEven` parameter.

### Tilemaps

- `TilemapLayer` and `TilemapGPULayer` now support a parent matrix during rendering.
- Added new optional `sortByY` parameter to the Tilemap `createFromObjects` method (thanks @saintflow47)

### Phaser v3 Enhancements Merged

All enhancements from late Phaser v3 development have been merged into v4. This includes:

- `Transform#getWorldPoint`
- `Layer#getDisplayList`
- `DynamicTexture` and `RenderTexture` changes:
  - `forceEven` parameter forces resolution to be divisible by 2.
  - `clear(x, y, width, height)` method now takes the listed optional parameters.
- `Rectangle` now supports rounded corners.
- `Physics.Matter.Components.Transform#scale` for setting scaleX and scaleY together.
- `WebGLRenderer` reveals functions around context loss:
  - `setExtensions`
  - `setContextHandlers`
  - `dispatchContextLost`
  - `dispatchContextRestored`
- Improvements to tile handling for non-orthogonal tiles.
- `Tween#isNumberTween`
- Many other fixes and tweaks.

### Other New Features

- Add documentation for writing a `Extern#render` function.
- `Shape` now sets `filtersFocusContext = true` by default, to prevent clipping stroke off at the edges.
- `Graphics` has a new `pathDetailThreshold` property (also available as a game config option) that skips vertices within a certain distance of one another, greatly improving performance on complex curves displayed in small areas.

---

## Updates and Improvements

### Rendering and Performance

- WebGL2 canvases are now compatible with the WebGL renderer.
- Optimize multi-texture shader.
  - Shader branching pattern changed to hopefully be more optimal on a wider range of devices.
  - Shader will not request the maximum number of textures if it doesn't need them, improving performance on many mobile devices.
  - Shader no longer performs vertex rounding. This will prevent many situations where a batch was broken up, degrading performance.
- `BatchHandler` render nodes now create their own WebGL data buffers.
  - This uses around 5MB of RAM and VRAM in a basic game.
  - Dedicated buffers are an optimum size for batch performance.
- Drawing contexts, including filters, can now be larger than 4096 if the current device supports them. Thanks to kimdanielarthur-cowlabs for suggesting this.
- Balance rounded rectangle corners for smoothness on small corners while preventing excessive tesselation.
- Improve RenderSteps initialization, removing a private method substitution.
- Better roundPixels handling via bias.
- Fix shader compilation issues on diverse systems.
  - Shapes/Graphics should work again in Firefox.
  - Issues with inTexDatum should be eliminated in affected Linux systems.
- Fix Extern and extend its rendering potential (see Beam Examples).
- BaseFilterShader now accesses loaded shader cache keys correctly.

### Round Pixels

- Set `roundPixels` game option to `false` by default. It's very easy to get messy results with this option, but it remains available for use cases where it is necessary.
- Limit `roundPixels` to only operate when objects are axis-aligned and unscaled. This prevents flicker on transforming objects.

### Filters Improvements

- Mask filter now uses current camera by default.
- Mask Filter now uses world transforms by preference when drawing the mask. This improves expected outcomes when mask objects are inside Containers.
- Filters are correctly destroyed along with their owners, unless `ignoreDestroy` is enabled. This supports multi-owner Filter controllers.

### Camera

- `GameObject#enableLighting` now works even if the scene light manager is not enabled. The light manager must still be enabled for lights to render, but the game object flag can be set at any time.
- `YieldContext` and `RebindContext` render nodes now unbind all texture units. These nodes are used for external renderer compatibility. An external renderer could change texture bindings, leading to unexpected textures being used, so we force texture rebind.

### Input

- Gamepad buttons initialize as not being pressed, which created a problem when reading Gamepads in one Scene, and then reading them in another Scene. If the player held the button down for even a fraction of a second in the first scene, the second scene would see a bogus Button down event. The `Button` class now has a new optional `isPressed` boolean parameter which the `Gamepad` class uses to resolve this, initializing the current pressed state of the Button (thanks @cryonautlex)

### Other Updates

- Clarified that `Tilemap.createLayer()` with `gpu` flag enabled only works with orthographic layers, not hexagonal or isometric. Thanks @amirking59!
- UUIDs for DynamicTexture names.
- DynamicTexture can resize immediately after creation.
- `PhysicsGroup.add` and `StaticPhysicsGroup.add` will now check to see if the incoming child already has a body of the wrong type, and if so, will destroy it so the new correct type can be assigned. Fix #7179 (thanks @bvanderdrift)

---

## Bug Fixes

### Rendering and Filters

- Fix `WebGLSnapshot` orientation.
- `WebGLSnapshot` and snapshot functions based on it now return the correct pixel, instead of the one above it (or nothing if they're at the top of the image).
- Fix filters rendering outside intended camera scissor area.
- Fix `RenderSteps` parameter propagation into `Layer` and `Container`. This resolves some missing render operations in complex situations.
- Fix GL scissor sometimes failing to update. The actual issue was, we were storing the screen coordinates, but applying GL coordinates, which can be different in different-sized framebuffers. `DrawingContext` now takes screen coordinates, and sets GL coordinates in the `WebGLGlobalWrapper`.
- Fix parent transform on filtered objects (e.g. masks inside containers).
- Fix `Filters#focusFilters` setting camera resolution too late, leading to unexpected results on the first frame.
- Fix parent matrix application order, resolving unexpected behavior within Containers.
- Fix `FillCamera` node being misaligned/missing in cameras rendering to framebuffers.
- Fix errors when running a scene without the lighting plugin.
- Lighting fixed on rotated or filtered objects.
- Fix `Shape` not respecting lights even though it had the lighting component.
- Fix blend modes leaking onto siblings within a `Container`. Thanks to @saintflow47, @tickle-monster and @leemanhopeter for reporting this.
- `Container` now updates the blend mode it passes to children more accurately, preventing blend modes from leaking from one child into another child's filters. Thanks @leemanhopeter!
- `Blend` filter parameter `texture` now correctly documented as `string`.
- `ColorMatrix` filter correctly blends input alpha.
- `Filters` now correctly handles non-central object origins when the object is flipped. Thanks @ChrisCPI!
- `Glow` filter acts consistently when `knockout` is active.
- `Mask` filter now correctly resizes and clears when the game resizes to an odd width or height, fixing a bug where masks might overdraw themselves over time. Thanks @leemanhopeter!
- `ParallelFilters` filter memory leak eliminated (this would occur when both passes had active filters).
- Filters now correctly transform the camera to focus objects with intricate transforms.
- Filters now correctly handle parent transforms when focusing to the game camera.
- `Blocky` filter now has a minimum size of 1, which prevents the object from disappearing.
- Fix `flipX`/`flipY` in `Filter#focusFilters`.
- Fix `BatchHandlerQuad#run()` parameter `tintFill`, which was set as a Number but should be used as a Boolean.
- WebGLRenderer destroys itself properly.
- Fix filter padding precision.
- Fix filter padding offset with internal filters.
- Fix shader not switching when TilemapLayer and TileSprite are in the same scene.
- Fix UV coordinates in `Shader`.
- Fix Shadow filter direction.
- Fix reversion in BitmapText kerning.
- Fix `CaptureFrame` compatibility with `Layer` and `Container`.
- In Layer and Container objects, use that object's children for the `displayList` passed to `RenderWebGLSteps`.
- Children of filtered `Container`/`Layer` objects are correctly added to the current camera's `renderList`. This fixes an issue with input on overlapping interactive objects.
- `DynamicTexture` method `startCapture` now handles nested parent transforms correctly. This is used in `Mask`, so masks within `Container` objects should behave correctly too.

### Camera Fixes

- Fix camera shake.
- Fix camera transform matrix order issues, as seen when rendering through transformed cameras.
- Fix reversion that removed camera zoom on separate axes.

### Physics

- Fix Arcade Physics group collisions, `nearest` and `furthest`, and static group refresh (thanks @samme)
- `ArcadePhysics#closest()` and `#furthest()` are properly defined (thanks @samme)
- Arcade Physics OverlapCirc() and OverlapRect() error when useTree is false. Fix #7112 (thanks @samme)
- Added missing 'this' value for Group.forEach and StaticGroup.forEach (thanks @TadejZupancic)
- `PhysicsGroup.add` and `StaticPhysicsGroup.add` will now check to see if the incoming child already has a body of the wrong type, and if so, will destroy it so the new correct type can be assigned.
- Fix `MatterTileBody` scope issue that caused a crash when processing flipped tiles because Body.scale() was called with null (thanks @cyphercodes)

### Tilemap Fixes

- Fix boundary errors on the Y axis in `TilemapGPULayer` shader, introduced after switching to GL standard texture orientation.
- `TilemapGPULayer` now respects camera translation (thanks @aroman)
- `TilemapGPULayer` now takes the first tileset if it receives an array of tilesets, which is valid for Tilemaps but not for TilemapGPULayer (thanks @ChrisCPI)
- Fix `createFromTiles` to handle multiple tilesets when using sprite sheets. Fix #7122 (thanks @vikerman)

### DynamicTexture and RenderTexture Fixes

- Fix `DynamicTexture` errors when rendering Masks.
- Prevent `RenderTexture` from rendering while it's rendering, thus preventing infinite loops.
- Fix `DynamicTexture` using a camera without the required methods.
- Fix positioning of Group members and offset objects in `DynamicTexture#draw`.
- Fix `DynamicTexture` turning black if it initially has a power-of-two resolution and is resized to a non-power-of-two resolution. Now any WebGL texture resize will wrap with REPEAT if it is power of two, or CLAMP_TO_EDGE if not. Thanks to @x-wk for reporting this.
- Masks work (again). Big feature!

### Game Object Fixes

- Fix `Grid` using old methods. It was supposed to use 'stroke' just like other `Shape` objects, not a unique 'outline'.
- `Grid` shape now sets stroke correctly from optional initialization parameters, at 1px wide. Use `Grid#setStrokeStyle()` to customize it further (thanks @Grimshad)
- Fix Layer's use of RenderSteps.
- Throw an error if `DOMElement` has no container.
- Fix `TileSprite` applying `smoothPixelArt` game option incorrectly.
- Fix missing reference to Renderer events in `BatchHandler` (thanks @mikuso)
- `WebGLProgramWrapper` now correctly recognizes uniforms with a value of `undefined` and can recognize if they have not changed and do not need updates.

### Texture Fixes

- Fix `TextureSource.resolution` being ignored in WebGL.
  - This fixes an issue where increasing text resolution increased text size.
- Allow `TextureSource#setFlipY` to affect all textures (except compressed textures, which have fixed orientation).
- Fail gracefully when a texture isn't created in `addBase64()`.
- Fix texture offsets in `ParseXMLBitmapFont` (thanks @leemanhopeter)
- Fix `TextureManager.addUint8Array` method, which got premultiplied alpha wrong and flipY wrong.
- Fix `Textures.Parsers.AtlasXML` passing trimmed and untrimmed dimensions in the wrong order to setTrim(), causing frame.realWidth to return the trimmed size instead of the original size. This made setOrigin() compute incorrect pivots for any non-default origin. Fix #7245 (thanks @cmnemoi)
- Fix `Texture#getFrameBounds` no longer includes the last frame (`__BASE`), as it caused an incorrect calculation of the bounds (always `{x:0, y:0, w: textureWidth, h: textureHight}`) (thanks @jjcapellan)

### SpriteGPULayer Fixes

- Fix `SpriteGPULayer` segment handling (segments changed from 32 to 24 to avoid problems with 32-bit number processing)
- Allow negative acceleration in `SpriteGPULayer` member animations using Gravity.
- Rearrange `SpriteGPULayer` data encoding.
- Fix `SpriteGPULayer` failing to generate frame animations from config objects.
- Fix `SpriteGPULayer#getMember()`, which previously multiplied the index by 4.
- Fix `SpriteGPULayer` creation time handling getting confused by 0.

### Input Fixes

- `GamepadPlugin.stopListeners` and `GamepadPlugin.disconnectAll` now have guards around them so they won't try to invoke functions on potentially undefined gamepads (thanks @cryonautlex)

### Loader and Audio

- Fix audio files not loading from Base64 data URIs (thanks @bagyoni)
- The Loader `GetURL` function did not treat `file://` URLs as absolute. When a baseURL is set, it gets prepended to an already-absolute path, producing double-prefixed URLs (thanks @aomsir)

### Tweens and Timeline

- Fixed a crash in `TweenBuilder` when the targets array contains null or undefined elements (thanks @aomsir)
- Fixed a bug where multiple `Timeline` events with `once` set to `true` would silently break the timeline and prevent all future events from firing. Fix #7147 (thanks @TomorrowToday)
- Fix `TimeStep#stepLimitFPS` to drop fewer frames, running much more smoothly at the target frame rate. Thanks to @Flow and @Antriel for discussing the topic.
  - Documentation in `FPSConfig#limit` now clarifies that frame limits are only necessary when artificially slowing the game below the display refresh rate.

### Other Fixes

- Improve `TransformMatrix.setQuad` documentation.
- `ColorMatrix.desaturate` is no longer documented as `saturation`.
- Add `@return` tag to `FilterList#addBlend` (thanks @phasereditor2d!).
- Add typedefs for the `{ internal, external }` structure of `Camera#filters` (and `GameObject#filters`).
- Fix `FilterList#addMask` docs.
- Fix `Scenes.Systems#destroy` not removing the `cameras` plugin correctly.

---

## Documentation and TypeScript

Fixes to TypeScript documentation: thanks to SBCGames and mikuso for contributions!

Add documentation for writing a `Extern#render` function.

---

## Thanks

Phaser v4 would not be possible without the community. Thank you to everyone who reported bugs, submitted fixes, contributed to the documentation and TypeScript definitions, and helped with beta testing:

@amirking59, @Antriel, @aomsir, @aroman, @bagyoni, @bvanderdrift, @captain-something, @chavaenc, @ChrisCPI, @cryonautlex, @DayKev, @Flow, @Grimshad, @ixonstater, @justin-calleja, @leemanhopeter, @Legend-Master, @mikuso, @ospira, @OuttaBounds, @phasereditor2d, @raaaahman, @saintflow47, @samme, @SBCGames, @skhoroshavin, @TadejZupancic, @tickle-monster, @TomorrowToday, @Urantij, @vikerman, @x-wk

And special thanks to kimdanielarthur-cowlabs for filter improvements.
