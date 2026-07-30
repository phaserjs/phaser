# Phaser 4 Rendering Concepts

Phaser 4 is a total overhaul of the WebGL rendering engine. In this article we'll go through _why_ we needed an overhaul, _what_ we added in the process, and _how_ the renderer does what it does, with a focus on performance.

## State of Phaser 3: Why We Did It

Phaser 3 has been evolving over several years. This made it a highly capable game engine for the Web. It established rendering solutions for performant gaming situations, powerful effects, and flexible rendering targets.

However, these solutions all had to share the WebGL state. WebGL works by setting various internal parameters, the "state", which take effect when commands run. For example, to create a texture with premultiplication, we run `gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)` to set the state, then run `gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)` to upload `image` with premultiplication. The `texImage2D` command has no way to set premultiplication; it is provided solely by the WebGL state.

There are a lot of internal parameters in the WebGL state, so there are a lot of possible settings that could apply to a command. We have to make sure that every relevant parameter is correct before running that command, or something could go wrong: a texture could appear upside-down, or be cut off at the wrong place, or try to draw to itself (this is an error).

The problem was, Phaser 3 generally trusted each rendering solution to handle WebGL itself. So if a single solution forgot to set or unset a parameter, the WebGL state would start to do unexpected things in other solutions. For example, some kinds of FX (but not all) would mess up a Mask.

It was no longer tenable to align all the disparate rendering solutions. We had to rebuild the render system, such that rendering didn't require alignment at all.

### Goals of the New Renderer

- If it ain't broke, don't fix it. The Phaser 3 API should remain intact everywhere, except the new renderer and renderer-related systems.
- Manage WebGL state. We should always know what the state is.
- Facilitate WebGL context restoration. Sometimes, the browser can revoke WebGL. With a managed state, we know all the settings to re-apply.
- Prioritize context-agnostic rendering. Objects should render the same way whatever context they're in, and require minimal knowledge of context. This makes behavior easy to predict for developers.
- Externalize drawing. If Phaser itself can handle a standard drawing procedure, objects can remain agnostic about these standards and handle less data themselves.
- Follow standards. WebGL has its own ideas about coordinate orientation, GLSL shader code, etc. Wherever possible, we should adhere to WebGL's standards, and not try to fight them.
- Make major changes. Phaser 4 is a major release, so it's the perfect time to fix API decisions that were holding us back in Phaser 3.
- Centralize quads. Our early development mantra was "Phaser draws quads". A lot of WebGL practices are best for 3D applications, with models consisting of large collections of linked triangles. But Phaser draws sprites, which are four-sided ("quad") shapes, so that's what we should do best.
- Prioritize performance. Everything should go fast.

## What's New in Phaser 4

As Phaser 4 developed, and went through a great public beta process, we found opportunities to add and update features. Let's look at significant removals, additions, and changes.

This is not an exhaustive list. As always, check the API documentation for the most accurate details.

### Significant Removals

- Canvas considered deprecated
- Pipelines
- Derived FX
- `Mesh` and `Plane`
- `BitmapMask`
- `Point`

#### Canvas considered deprecated

The Canvas renderer is still available, but it should be considered deprecated. Canvas rendering doesn't support any of the WebGL techniques we use to provide advanced rendering features. Many features from Phaser 3 never worked in Canvas, and almost everything new in Phaser 4 is not available in Canvas.

As WebGL support is effectively baseline today, it makes sense to focus on WebGL over Canvas.

Canvas does have one advantage: a wider range of blend modes. WebGL only supports NORMAL, ADD, MULTIPLY, and SCREEN out of the 27 modes in Canvas. The WebGL renderer can recreate these modes with the new `Blend` filter, although you can't just blend things straight onto the scene: you have to use a CaptureFrame object, DynamicTexture or other means of indirection.

#### Pipelines

A `Pipeline` was a Phaser 3 rendering system. Frequently, pipelines had several responsibilities, such as the Util pipeline which handled various different rendering tasks. This contributed to some of the alignment difficulties.

The Pipeline was replaced by the `RenderNode` in Phaser 4. A render node is intended to handle a single rendering task. This makes maintenance straightforward. All render nodes have a `run` method to execute that task. Some render nodes have a `batch` method, so they can assemble state from several sources before invoking `run`.

It's generally not necessary to handle render nodes, but game objects do maintain `defaultRenderNodes` and `customRenderNodes` maps to support configuration. Common tasks like enabling lighting, which originally involved assigning a new pipeline, can now be performed via `gameObject.setLighting(true)`.

#### Derived FX

The FX `Bloom`, `Circle`, `Gradient`, and `Shine` were replaced with Actions or GameObjects.

These FX are all "derived" from other, more basic processes. `Bloom` is a combination of blurring, thresholding, and blending. `Circle` was just a specialized mask. `Gradient` is better suited as a GameObject, because it doesn't alter an existing image: it replaces it. `Shine` is a blend of a gradient over a target, and should have full control over movement.

We removed these effects, and replaced them with other ways to get the same result.

`Bloom` is now accessed via `Phaser.Actions.AddEffectBloom()`. This creates a set of filters which apply bloom to the target, either the camera or a game object.

`Shine` is now accessed via `Phaser.Actions.AddEffectShine()`. This creates a Gradient and uses it to blend a shine across the target.

`Circle` is now a case of `Phaser.Actions.AddMaskShape()`. This creates a Shape and uses it to add a mask.

See below for how FX (and Masks) have become Filters.

#### `Mesh` and `Plane`

We intend to handle 3D properly in the future, so we removed these limited 3D implementations.

#### `BitmapMask`

The `BitmapMask` class was removed, because it was only ever used in WebGL, and WebGL now has the Mask filter for more powerful masking operations.

`GeometryMask` remains available in the Canvas renderer, but not in WebGL.

#### `Point`

The `Point` class was removed because it overlapped with `Vector2`. We only need one way to represent x,y coordinates.

### Significant Additions

The following game objects were added. They are all only available in WebGL, except Stamp which is also available in Canvas.

- `CaptureFrame`
- `Gradient`
- `Noise`
- `NoiseCell2D`, `NoiseCell3D` and `NoiseCell4D`
- `NoiseSimplex2D` and `NoiseSimplex3D`
- `SpriteGPULayer`
- `Stamp`
- `TilemapGPULayer`

#### `CaptureFrame`

The `CaptureFrame` game object does not render. Instead, it copies whatever has already been rendered, and saves it to a texture for later. This is useful for applying filters to part of the scene's depth, without messing about with layers, containers, or dynamic textures. As it is a simple object, it can be moved around in the display list to change what it captures.

Technically, CaptureFrame copies the WebGL framebuffer that is currently bound. Mostly this means the main game canvas. Filters and DynamicTextures use their own framebuffers, so a CaptureFrame inside a Container with filters will capture just the contents of the Container.

#### `Gradient`

The `Gradient` game object renders color gradients. These can be as simple as linear gradient of one color into another color, or as complex as a series of different-sized bands of colors radiating from a center. A Gradient gives you control of its shape in several modes. Its colors are defined in a `ColorRamp`, which contains a list of `ColorBand` objects, each of which describes two colors and a transition between them, in various modes including HSV support.

Every number between 0 and 1 corresponds to a precise color from the gradient ramp. You can access these through code, if you want to use a ColorRamp without rendering it.

The Gradient object extends `Shader`. The fragment shader supports millions of bands per gradient, through the use of a data texture which encodes information about the bands in a binary tree.

#### `Noise`

The `Noise` game object extends Shader to render random noise. This can be used for static, added texture, or other visual effects.

Behind the scenes, random noise is achieved by running several arithmetic operations and taking just the last few decimal places, which are very unpredictable. Our algorithm is an old technique compatible with WebGL, and it is definitely not safe for cryptographic security purposes. There are more advanced techniques available via bitshifting in WebGL2, but we have stuck with WebGL for wider compatibility.

Noise is also available in code via `Phaser.Math.Hash()`. This uses an identical algorithm for parity with the shader. However, because this randomness is very sensitive to change, it might not produce the same results on the CPU as on the GPU. This is a useful source of reproducible randomness for games.

#### `NoiseCell2D`, `NoiseCell3D` and `NoiseCell4D`

The `NoiseCell` family of game objects extend Shader to render cellular noise. This is also called Worley noise or Voronoi noise. It consists of a grid in 2, 3, or 4 dimensions, which is distorted by random amounts to create a pattern of cells. This has a distinctive pebbly or faceted look. You can add octaves of noise to make the pattern more intricate and naturalistic.

The higher-dimensional versions of NoiseCell render a slice through 3D or 4D space. You can slide that slice along the Z or W axes to smoothly animate the texture.

Internally, NoiseCell shaders use the same randomness algorithm from Noise. It is only evaluated at grid points.

Cellular noise is also available in code via `Phaser.Math.HashCell()`.

#### `NoiseSimplex2D` and `NoiseSimplex3D`

The `NoiseSimplex` family of game objects extend Shader to render simplex noise. This is a modern gradient noise implementation. We use a version which supports tiling and "flow", a periodic animation. Versions are available in 2 and 3 dimensions; higher dimensions are not particularly necessary. Extensive options allow you to create many natural phenomena such as clouds, fire, and water.

Internally, NoiseSimplex uses the same randomness algorithm from Noise. It is evaluated at points of a "simplex grid", a pattern of triangles or tetrahedrons where each point contains a random vector. The vectors can be twisted to create "flow".

Simplex noise is also available in code via `Phaser.Math.HashSimplex()`.

#### `SpriteGPULayer`

The `SpriteGPULayer` game object renders high efficiency static objects. It is intended to render millions of background objects. By comparison, Phaser 3 and 4 can typically render tens of thousands of sprites with good performance. SpriteGPULayer is a hundred times faster.

SpriteGPULayer is very powerful, but requires special handling to reach its full potential. It works because, unlike other WebGL rendering systems, it doesn't update its data every frame. It renders a large buffer of static data. You can update its data after it is created, but this update costs, just like regular sprites.

Why not just render a flat background image? First, SpriteGPULayer supports scroll factor on its member objects, allowing background parallax. Second, although it is static, it can still be animated. Member objects can use frame animation, and also support an extensive range of customizable animations on their properties. They can fade in and out, bounce around or wave in the wind, grow and shrink, fall past the camera repeatedly, adjust their colors, etc. They're perfectly suited to bring life to a non-interactive background.

SpriteGPULayer is the reflection of other Phaser game objects, which are interactive and get updated every frame. We were checking for bottlenecks in the regular rendering process, and we realized that the GPU update bottleneck simply went away if the data was static. Thus SpriteGPULayer was born.

#### `Stamp`

The `Stamp` game object renders a quad without any reference to the camera. This is mostly used for `DynamicTexture` operations, but it might be useful elsewhere. Note that, because it doesn't use the camera at all, it may occasionally create unexpected results.

#### `TilemapGPULayer`

The `TilemapGPULayer` object is an option within `Tilemap`. When you create a `TilemapLayer`, you can instead create a TilemapGPULayer.

TilemapGPULayer renders the layer as a single quad. This has quality and performance advantages. Because the shader has knowledge of the full layer, it can accurately blend across tile boundaries, resulting in perfect texture filtering when antialiasing is enabled. And because the shader cost is per-pixel, not per-tile, it can render very quickly.

Because it renders per-pixel, TilemapGPULayer suffers no performance loss when rendering large numbers of tiles. It can render a tile layer up to 4096x4096 tiles, and will happily render the entire layer just as quickly if the camera zooms out to see all 16 million tiles. If you need extremely large numbers of tiles on screen at once, TilemapGPULayer is a superior choice for mobile platforms.

### Significant Changes

We changed the way we handle some systems. We want to preserve the API wherever possible, but in some cases changes were necessary.

- GL Orientation
- FX and Masks are now Filters
- Lighting
- `DynamicTexture` and `RenderTexture` API
- `Graphics` and `Shape` API
- `Shader` API
- `TileSprite` API

#### GL Orientation

GL and WebGL use different coordinate systems than other computer systems. In most systems, the coordinate 0,0 refers to the _top left_ of the screen. In GL, it refers to the _bottom left_ of textures, and the _middle_ of vertex clip space.

Phaser 3 chose to represent things using top-left orientation. This led to mismatches between different parts of the system: it would draw framebuffers upside-down, then flip them over to draw to the screen, where GL conventions must be followed.

Phaser 4 has switched to using GL orientation. This is largely invisible to the user, as we take care of texture coordinate handling. Some shader code may need to be revised, as the top and bottom might have switched. Mostly it just simplifies the codebase.

If you are using **compressed textures**, note that Phaser 4 requires them to be encoded with the Y axis pointing "up". This is usually available as a "flip Y" option in your texture compression software. We cannot re-encode these textures at runtime, due to the way compression achieves efficiency. See the Compressed Textures guide for easy, correct handling of compressed textures.

#### FX and Masks are now Filters

We unified FX and Masks under the new title Filters. Filters are handled in a standard way, ensuring that they are all compatible even if they have no knowledge of one another.

A Filter is a simple process: it takes an input image, and creates an output image. In most cases this can be done with a single shader program, so custom filters are easy to author.

Filters can be applied to any game object or scene camera. Phaser 3 had restrictions on which objects supported FX, and whether preFX and postFX were available. Phaser 4 does not have this restriction. You can even apply filters to `Extern` objects.

Filters are divided into "internal" and "external" lists. Internal filters affect just the object. External filters affect the object in its rendering context, usually the full screen. Internal filters are a good way to have filters match the position of the object.

Note that some objects cannot define the internal space, so they use the external space instead. Objects without width or height are affected. `Shape` objects are also affected, as they may have a stroke which would be cut off by the reported width and height; they can turn this off by setting `shape.filtersFocusContext = false`.

As noted above, we removed the filters Bloom, Circle, Gradient, and Shine. They are available as actions or game objects.

The existing filter ColorMatrix shifted its color management methods onto a property called `colorMatrix`, so you would now call `colorMatrix.colorMatrix.sepia()`.

We added the new filters Blend, Blocky, Combine Color Matrix, Gradient Map, Image Light, Key, Mask, Normal Tools, Panorama Blur, Parallel Filters, Quantize, Sampler, and Threshold.

Blend combines the input with a texture. This is similar to blend modes, but whereas WebGL blend modes are fairly restricted, this filter supports all the blend modes available in the canvas renderer. The Blend filter also support overdriving, mixing outside the usual 0-1 range, which can create useful color effects.

Blocky pixelates the image using pixels from the center of grid cells. This is similar to Pixelate, but that uses extra samples to smooth the color. Blocky may be less smooth, but always returns a color that exists in the image.

Combine Color Matrix uses color channels from another image. You can use this to take one image's brightness and turn it into an alpha channel for another image, among other operations.

Gradient Map uses image brightness to drive a ColorRamp. You can use this to rewrite the palette of an image at render time, or just create wild effects.

Image Light uses a normal map and an environment map to create Image Based Lighting. This is a quick and easy way to apply realistic lighting to objects. You can use proper 360 degree panoramas for realistic reflections, or simpler gradients or images to give the impression of a natural scene.

Key erases or isolates a specific color.

Mask takes the place of masks in Phaser 3. It can take a texture, or a game object, which it draws to a DynamicTexture. Note that a Container with other objects, even objects with their own filters and masks, is a valid mask source.

Normal Tools allows you to rotate, squish, and otherwise manipulate normal maps. It also supports "ratio" output, measuring how closely the surface faces the viewpoint. Many filters can produce or use normal maps, and Normal Tools helps you control them.

Panorama Blur is a special kind of blur which runs in spherical space. It's intended to average out 360 degree panorama files for Image Light to create diffuse environment maps. While it is an inefficient filter as it has to sum half the image into each pixel, it might be useful for real-time environment capture.

Parallel Filters passes the input image through two different filter lists, and combines them at the end. It is useful when you want some memory in a complex stack of filters.

Quantize reduces the number of colors in the image. This can create a retro effect. It implements dithering with Interleaved Gradient Noise, which creates excellent quality even with very few colors.

Sampler extracts data from the WebGL texture and sends it back to the CPU for use in a callback. It is similar to the snapshot functions available on DynamicTexture.

Threshold applies a soft or hard threshold to the colors in the image.

#### Lighting

In Phaser 3, lighting was added to objects by adding a new pipeline.

In Phaser 4, simply call `gameObject.setLighting(true)`. You don't need to worry about _how_ lighting is applied, just that we're taking care of it.

Lighting is available on many game objects, including BitmapText, Blitter, Graphics and Shape, Image and Sprite, Particles, SpriteGPULayer, Stamp, Text, TileSprite, Video, and TilemapLayer and TilemapGPULayer.

Objects can now cast "self-shadows", using a more realistic shader to simulate the shadows cast by features on their own surface. This uses the brightness of the texture to guess how concave or convex the surface is at a given point. Self shadows can be enabled as a game-wide setting, or per-object.

In Phaser 3, lights had an implicit height, based on the game resolution. In Phaser 4, lights have a Z value to set this explicitly.

Note that lighting changes the shader, which breaks batches (see below).

> You can also use the `ImageLight` filter to apply lighting, but it is not part of the core lighting system, and is not good for nearby light sources.

#### `DynamicTexture` and `RenderTexture` API

`DynamicTexture` allows you to draw to a texture at runtime, then use it on other objects.

In Phaser 3, DynamicTexture allowed you to define batches and perform other intricate drawing operations. While efficient, this was too technical for most uses. In addition, it used its own drawing logic, which made for compatibility issues.

In Phaser 4, we removed many of these complex methods. Instead, we used the basic rendering system, which supports batching automatically. As a concession to the change, you **must** now call `dynamicTexture.render()` to execute all buffered drawing commands.

The new `capture()` method is similar to `draw()`, but supports more configuration, and captures the current camera view of a game object.

The new `preserve()` method interacts with the drawing command buffer. DynamicTexture now stores its commands in a buffer, waiting for execution via `render()`. Normally, it clears the buffer after it renders. You can choose instead to preserve a series of drawing commands, allowing you to render them many times. This is useful if you're drawing game objects which change over time.

The new `callback()` method inserts a callback to run as the drawing command buffer executes.

The `repeat()` method uses a `TileSprite` behind the scenes, so its capabilities are extended to match.

##### `RenderTexture`

The `RenderTexture` game object wraps a DynamicTexture. It has all the same drawing methods, mapped to its DynamicTexture.

RenderTexture has a new property: `renderMode`. When set to "render", this draws the RenderTexture like an ordinary Image. When set to "redraw", the RenderTexture instead runs `render()`, updating its texture, but does not draw itself. When set to "all", it does both.

The "redraw" renderMode allows RenderTexture to update a texture _during_ the render loop. This was not possible before, and it allows you to draw things that have only just updated, such as same-frame shader outputs or other RenderTextures.

#### `Graphics` and `Shape` API

The `Graphics` game object is largely unchanged, as is the `Shape` which uses the same render systems, but there are a couple of improvements.

Graphics has a new `pathDetailThreshold` property. This can also be set as a global game config option. This option skips vertices within a certain distance of one another, greatly improving performance on complex curves displayed in small areas.

Shape has updates to `Rectangle` and `Grid`. Rectangle now supports rounded corners (this was introduced in Phaser v3.89). Grid has changed some property names to follow the conventions of other Shapes: it has a stroke instead of an outline. Grid also has controls for how to render the gutters between grid cells, and whether to draw outlines on the outside of the grid or just between cells.

#### `Shader` API

The `Shader` game object allows you to use custom shader code instead of a texture for a quad. Shader objects will need to be rewritten for Phaser 4.

The game object construction signature has changed. It now takes a config object (`ShaderQuadConfig`) which allows you to configure the way the shader executes. Consult examples or the Shader Guide at phaser.io for more details on shader setup.

Shaders formerly set a number of shader uniforms in line with websites like Shadertoy. These uniforms are no longer set automatically. You can encode them into your configuration if you need to use them.

Note that the texture coordinates of your shader will now use GL conventions, where Y=0 is at the _bottom_ of the image.

##### GLSL Changes

The way Phaser loads GLSL code has changed.

GLSL code is now loaded without regard as to how it will be used. It is not classified as fragment or vertex code, because under the new system it could be either, or both. You load fragment and vertex shaders separately, and combine them when creating a Shader.

We have removed custom templates from the shader code. We now use `#pragma` preprocessor directives, which are valid GLSL. This means our shader code works with automated syntax checkers. (The pragmas are removed before compilation. They serve merely as identifiers for our custom templates.)

The Shader Guide explains more about how shaders are composed, including Shader Additions which add configurable functionality to shaders. This is an advanced topic, and a pre-written shader doesn't need any addition code.

#### `TileSprite` API

The `TileSprite` game object displays a repeating texture across a quad. In Phaser 4 this has become more powerful, with frame support and tile rotation.

In Phaser 3, TileSprite used WebGL texture wrapping parameters to repeat the texture. These parameters control what happens when you sample outside the texture: do you get the edge of the texture, or a reflection of the texture, or a repeat of the texture?

However, this approach was limited. It would only repeat the entire texture file. In addition, there were problems with compressed textures, textures with a size that was not a power of two, and DynamicTextures.

So in Phaser 4 we switched to a different shader, manually controlling the texture coordinate wrapping instead of using texture wrapping parameters. This now supports any texture, and can use frames within that texture, thus enabling texture atlas/spritesheet support. It works like a regular game object.

The `tileRotation` property allows you to rotate the texture, so now it can be transformed any way you like.

## Rendering in Phaser 4: How It Works

This section describes how the Phaser 4 WebGL renderer works, in broad strokes, and how to get good performance from it.

### Performance Cheat Sheet

- The GPU is very fast, but sending commands back and forth is not.
- Draw calls are expensive. Don't use more than a few hundred.
- Group similar items together, allowing Phaser to create a batch with a single draw call.
- Filters and DynamicTextures/RenderTextures use draw calls, so use them sparingly.
- Data upload is expensive.
- More objects means more upload, so reduce object count where possible.
- Text (but not BitmapText) uploads a whole new texture on update, so update it sparingly.
- `SpriteGPULayer` and `TilemapGPULayer` do not upload data after creation, so they are much faster, at the cost of extra memory.
- Consider rendering complex but unchanging elements to a DynamicTexture for reuse.
- Filling pixels is expensive (the one place where the GPU might be a bottleneck).
- Layering objects is largely unavoidable, but every pixel costs, so avoid filling the entire screen repeatedly.
- Performance is important even if your game runs smoothly. You don't know how close you are to dropping frames until it happens.

### Rendering Basics

Like pretty much every game engine, Phaser sends commands to the Graphics Processing Unit (GPU), specialized rendering hardware.

The GPU runs a **shader program** to draw something. This is what we call a **draw call**. The shader program consists of two parts: the **vertex shader** and the **fragment shader**. The vertex shader computes the position and other values for a single vertex. These vertexes define the corners of triangles (Phaser uses two triangles to make a quad for a sprite). The fragment shader then fills in the triangles by interpolating the values of the vertices.

Fragment shaders usually "sample" textures. Textures are uploaded (copied) to the GPU from system memory. WebGL can use a certain number of textures at the same time, usually 8 or 16 depending on the current hardware. The textures currently in use are "bound" to numbered **texture units** while the shader program runs. They units can be rebound after drawing.

>We're going to talk about pixels, texels, and fragments. A **pixel** is a "picture element", and refers to one of the colored dots on your screen. A **texel** is a "texture element", and refers to one of the grid cells in a texture. A **fragment** is the result of a fragment shader, and might become a single texel that is drawn to a single pixel, or might be a smaller element that is combined to perform antialiasing, or something else. They're all pretty similar, though.

The GPU **filters** textures as it samples them. The simplest form of filtering is `NEAREST`, where it takes the nearest texel; this creates sharp edges on texels when textures are scaled up, good for a retro look. We can also use `LINEAR`, which blends into neighboring texels when sampling in between them; this creates smoother visuals, good for more naturalistic scenes. There are more advanced filter modes which use MipMaps, but Phaser doesn't use these by default, because they don't work well with texture atlases. You can implement them with game config options and careful texture creation.

> The `pixelArt` config option uses NEAREST sampling. Phaser 4 introduces the `smoothPixelArt` config option, which supports antialiasing but preserves sharp texels when scaled up. Both have their limits. PixelArt only works well when objects don't scale or rotate. SmoothPixelArt loses crispness until objects are scaled up, but is usually the correct choice for retro graphics with big pixels.

You can create **compressed textures** using tools such as TexturePacker or PVRTexTool. Phaser supports PVR and KTX compressed texture files. A compressed texture uses a special data layout which the GPU can access faster. Because of this layout, the compressed texture must be very precisely authored, and cannot be adjusted at runtime. Different devices support different compression algorithms.

>Compressed Texture Cheat Sheet
>
>- All formats support power-of-two resolutions, and some require it.
>- For good device coverage, select ASTC 4x4, ETC2, PVRTC 4bpp, and S3TC BC3 (aka DXT5) compression types.
>- Ensure that your compression software is receiving data in sRGB color space. If it receives linear RGB, the compressed texture will be too dark. You can fix this by following the steps in the WebGL Compressed Textures guide.

You can write to textures at runtime using **framebuffers**, which render to a texture instead of to the screen. Phaser provides `DynamicTexture` to draw in this way.

The GPU has a large number of cores, so it can run many copies of the shader program at once. This is why the GPU is so fast: it is highly parallel. A single draw call can instruct the GPU to draw a large number of vertices. The data for these vertices must be uploaded to the GPU before it can draw them. It is stored in a region of memory called a **buffer**.

The game world usually updates by changing buffers and uploading them. This upload is the main bottleneck in performance.

Shader programs also support a limited number of **uniforms**, parameters that can be changed for each draw call. They are "uniform" across all vertex and fragment shaders while the draw call is running, hence the name.

To sum up the way we draw something:

- Set the shader program.
- Set shader uniforms.
- Bind textures to texture units.
- Upload data buffer. (The slowest bit.)
- Draw the data.

### Efficient Rendering with Batching

Because each draw call has a cost, we prefer to run as few of them as possible. To make the most of this, we can pack lots of data into a single draw call. This is called "batching".

Batching requires a lot of things to line up. As you can see above, a draw call includes a shader program, specific uniforms, texture unit binding, a data buffer, and some other settings we haven't mentioned.

But if you're drawing the same things the same way, Phaser can pack many objects into a single data buffer, and batch them into a single draw call. This is very efficient, and we recommend doing it whenever possible.

The main way to get objects batched together is **texture choice**. When rendering images and sprites, Phaser can automatically bind several textures at once, allowing different textures to be part of the same batch. Note that the number of textures is device-dependent. On some mobile devices, multi-texturing has poor performance, so you can set the game config to automatically skip this step.

However, you usually have lots of objects in your game - more than the number of texture units available in the device hardware. So it's a good idea to create **texture atlases**, large texture files with many textures arranged inside them. The GPU doesn't care how many textures are in there; it just thinks it's one texture. Use software like TexturePacker to create texture atlases.

>It's good practice to add at least 1 pixel of padding around each texture in the atlas, in case the GPU does texture filtering during sampling and gets something blended with a different texture. If you see unusual colors on the edges of game objects, insufficient padding may be the cause.

When you use a different shader, a new batch begins. You can guess when a new shader is in use: a different kind of game object might have a new shader. For more precision, consider the following families of game objects.

| Family | GameObjects |
|---|---|
| Quad | Image, Sprite, BitmapText and DynamicText, Blitter and Bob, NineSlice, ParticleEmitter and Particle, RenderTexture, Text, Video |
| TileSprite | TileSprite |
| Flat | Graphics, Shape |
| PointLight | PointLight |

Most other game objects do not batch; we call these "Stand Alone Render" (SAR) objects. Every such object requires a draw call to itself, so it's relatively expensive.

Batches can also break (beginning a new batch) for a number of other reasons.

- Objects with filters (each filter is a shader rendering to a different framebuffer)
- Objects with different blend modes
- Objects with different lighting settings
  - Lighting enabled or not
  - Self-shadowing enabled or not
- Objects have different round pixels behaviors
  - If the round pixels option is on, objects with default rotation and scale use a different shader
- The batch is full

The batch can fill up completely. The default limit is 16,384 quads, because we can't address any more vertices with 16-bit indices. The limit can be lowered in the game config for some reason.

In summary, use similar objects to allow batching to improve performance.

### Buffer Memory Usage

Batch families use large vertex buffers, each large enough to hold all the data for that type of batch. This is always 16,384 instances long, as that is the maximum number of vertices which can be identified by a 16-bit integer address.

Some batch families also create an index buffer. This stores those vertex index values. This allows us to write fewer vertices to the vertex buffer. GL renders using triangles, and each quad is 2 triangles of 3 vertices each, so a quad with 4 corners should paradoxically take 6 vertices to render. Index buffers let us instruct GL to reuse some vertices, so a quad requires data for just 4 vertices. We save memory by using extra memory for an index buffer.

Phaser 4 creates several buffers when it boots, to handle common forms of rendering. These are as follows:

| Buffer Role | Size (bytes) |
|:--|--:|
| Generic single quad indices | 4 |
| Single quad indices | 12 |
| Single quad vertices | 112 |
| Batch flat indices | 98304 |
| Batch flat vertices | 589824 |
| Batch quad indices | 196608 |
| Batch quad vertices | 1835008 |
| Batch tilesprite indices | 196608 |
| Batch tilesprite vertices | 2883584 |
| **Total** | 5800064 |

Many shaders use an extra buffer to describe "instances". This buffer is generally only 4 instances long, tiny enough to ignore.

The `SpriteGPULayer` game object does not use a shared buffer. It needs to keep its data intact between frames, so it creates its own buffer. The size of this buffer is determined by the game object settings, and can go over 100 MB if you have millions of members. It trades memory for performance.

Textures take up memory on the GPU, proportional to their resolution. Assume 4 MB per megapixel. A texture with a MipMap uses 33% more memory. Because textures are stored as texels on the GPU, their format doesn't matter: a highly compressed JPEG still has the same number of texels as a lossless PNG. Format only matters for downloading the original texture. True compressed textures (PVR or KTX format) use less memory.

Some game objects, such as `Gradient`, `SpriteGPULayer`, and `TilemapGPULayer`, store extra data in textures. These textures are typically small and don't consume much memory. The `ColorRamp` in a Gradient stores 16 bytes per `ColorBand`, plus 8 bytes at the start of the file for extra data. SpriteGPULayer stores texture frame data as 12 bytes per frame. TilemapGPULayer stores two textures: the Tileset texture uses 8 bytes per entry in an animation sequence, and another 8 bytes per actual frame, while the tilemap texture uses 4 bytes per tile.

Each framebuffer has a texture, so it takes up memory too. It may have various "attachments" such as stencil, depth, etc, increasing its memory footprint.

The `DynamicTexture` and its `RenderTexture` wrapper object uses a framebuffer to store its texture.

Filters use framebuffers to render their output. When an object has several filters, each of them uses an extra framebuffer. These framebuffers are recycled after use: they are still held in memory, but only up to the number that were needed for a given size. Such framebuffers that are not used for a while are destroyed to free up system resources.

Buffers and textures are all created by the CPU in system memory, and remain there even after they're copied to the GPU. So memory is effectively consumed twice. Framebuffers do not exist in system memory, and exist only on the GPU.

Figures for system resources are not available in WebGL, because it's a bad idea to let the Internet randomly look at your device's specs. So it's best to be conservative with memory and performance usage, as you never know what kind of device you're running on.

### Performance by Skipping Things

Phaser renders ordinary sprites by computing their properties on the CPU, then sending them to the GPU. This has the advantage of supporting dynamic, interactive scenes, with very flexible outcomes. However, it has the disadvantage that all that computation, and the GPU upload, take a long time - they're bad for performance.

Wouldn't it be great if you could skip all that?

Phaser 4 has several systems that skip most or all of that work. They sacrifice interactivity and memory for improved performance. The difference can be dramatic.

#### DynamicTexture

- Initialization cost: as rendering a regular scene
- Runtime cost: 1 quad
- Memory cost: 1 texture

Use `DynamicTexture` to draw complex or expensive scenes to a texture once, then reuse the texture multiple times. It uses the same rendering code as regular scenes, so its initialization cost is predictable.

The `RenderTexture` game object holds a DynamicTexture. Use the `renderMode` property to redraw the texture during the game render loop. You can then reuse the texture on other objects, as input to a shader, etc.

#### SpriteGPULayer

- Initialization cost: assembling and uploading a large buffer
- Runtime cost: ~1% of the vertex cost of regular sprites, regular fill cost
- Memory cost: 168 bytes per layer member (on both CPU and GPU side)

Use `SpriteGPULayer` to render "static" layers of the scene. SpriteGPULayer uses a buffer of unchanging data to skip the upload cost. This makes a huge difference to performance. The game object supports animations and scroll factor per-member, enabling parallax backgrounds with lifelike animation. It can also be used for particle effects, one-off or repeating; and supports updates, although this has a performance cost.

Because SpriteGPULayer can display millions of objects, it's important to initialize it efficiently. If you create a new config for each member, it can take dozens of seconds to complete. It's best to create a single config object, and edit it for each new member, reducing the initialization time to under a second. This is a result of the way JavaScript initializes objects.

#### TilemapGPULayer

- Initialization cost: uploading 2 small textures
- Runtime cost: 1 quad (inefficient on some mobile devices)
- Memory cost: 2 small textures

Use `TilemapGPULayer` to render any number of tiles, with a fixed cost. By encoding the tilemap and tileset data into textures on the GPU, it can completely ignore the complexity of the tilemap. This works very well for displaying large numbers of tiles at once.

### Renderer Internals

Inside the renderer, we use a few core systems to keep things running smoothly. This should not be necessary for creating a game, but it may be interesting if you need to dig into the renderer itself.

#### WebGL State Manager

We maintain a record of all relevant WebGL state parameters, the `WebGLGlobalWrapper`. We set WebGL state parameters by setting properties on this record. This allows us to optimize: the state manager can skip commands that it knows won't change anything.

It also allows us to recreate the state if the WebGL context is lost.

> Do not make WebGL calls directly in a Phaser 4 game! This can change the WebGL state without updating the WebGLGlobalWrapper, and can cause changes to spiral out of control. If you want to change the WebGL state, either use the wrapper, or do it within an `Extern` game object, which runs a reset after it finishes on the assumption that the WebGL state changed unpredictably.

#### WebGL Resource Wrappers

WebGL resources such as textures and buffers are all stored in wrapper objects. These support context recreation like the state manager.

In addition, wrappers sequester the WebGL context itself. We should **never touch the `gl` object**, except through the wrappers. This ensures that all relevant logic is encapsulated, preventing other parts of the codebase from taking on too much responsibility.

#### `DrawingContext` Objects

When we render a frame, we begin with a `DrawingContext` object. This object describes the current drawing state. It describes which camera to use, what blend state is set, whether to draw to the main canvas or a framebuffer, the current viewport dimensions and scissor state, etc.

DrawingContext is passed into the render method, and is handed along with execution.

When a game object wants to change some part of the drawing state, we **clone** the current DrawingContext and edit the copy. We then declare that the copy is in use. This is one way that the system triggers the end of a batch render. Any change to the DrawingContext would change the way things render, so it is the right time to draw a batch.

Many properties of the DrawingContext are consulted all the way through the render process.

#### `RenderWebGLStep` Methods

Every game object has a `renderWebGLStep` method, which is called for rendering. Usually this immediately invokes `renderWebGL()`, the object's render method. The RenderWebGLStep system allows us to wrap the renderWebGL method in extra steps, however, such as when filters are being applied.

#### `RenderNode` Objects

The `renderWebGL` method is responsible for invoking one of a range of `RenderNode` objects, either by its `run` or its `batch` method. The render node performs a single rendering task, which may involve running other render nodes, or even running itself (usually when a batch needs to be drawn).

Shader programs are handled by certain render nodes. These render nodes track a lot of data about the structure of buffers and the information passed to the shader program. `BatchHandlerQuad` is the core of Phaser's regular sprite drawing operations, and is a good example of what goes on in there.

#### Shader Program Updates

Render nodes may decide that their shader program needs some tweaks. For example, BatchHandlerQuad might encounter a sprite with lighting enabled, when it wasn't for the previous sprite.

The render node checks various settings. If they must change, it orders the batch to draw, then continues to update the shader.

Shader updates use a system of additions to insert, activate, or deactivate parts of the shader code. The result is a new GLSL script. The first time this runs, WebGL must compile the shader. This usually takes less than a frame, but you still don't want to do it every time. So we cache the result using a key unique to that particular shader configuration. The next time we need that key, we can retrieve the shader we compiled last time.

#### Just-In-Time Rendering

Phaser waits until the last moment to issue actual WebGL commands. A RenderNode builds a buffer, object by object, and finally uploads it all at once. The system then uses the current DrawingContext to set up the WebGL state, binds required textures, and issues the draw command. By doing this all just-in-time, it avoids doing unnecessary work, and having one system trip over what another system is doing.

In most cases, the system draws using `WebGLRenderer#drawElements()`. This method uses the GL elements drawing method. In brief, this uses two buffers to draw: an attribute buffer, containing data about a vertex, and an index buffer, containing a list of _which_ vertices to draw in order.

Phaser draws quads. That's its main job, so we made it efficient. But WebGL doesn't draw quads; it only knows how to draw triangles. That's OK; a quad is just two triangles stuck together.

In Phaser 3, those triangles were drawn separately. This meant that a quad needed 6 vertices to describe it: 3 vertices per triangle.

In Phaser 4, we use GL elements to reduce this number. A quad only needs 4 vertices. With the index buffer, we can order it to repeat those vertices for different triangles. This means we only need to upload 2/3 as much vertex data.

The result is an efficient, reliable renderer, which meets all the original goals.

## A New Foundation

Phaser 4 provides a robust foundation for future development. Its systems are designed to be efficient and stable, capable of handling rendering tasks with highly reliable compatibility, thanks to the WebGL state management system.

We already have a handful of high-performance systems, such as `SpriteGPULayer` which can render millions of objects. Other systems can take advantage of the encapsulation provided by this paradigm too, adding to the rendering capabilities of the Phaser platform. Wouldn't it be neat to have a full 3D solution? Maybe one day! We have the tools to approach it in a reliable way.

Right now, the system uses the original WebGL, as it is the most widely-available rendering API. It shouldn't be too difficult to extend these principles to WebGL2 and WebGPU, the successors to WebGL. The main advantages to such an upgrade include more freedom to manage GPU buffers, greater bit depth formats to support more advanced rendering solutions, and asynchronous rendering for better performance (although last we checked, WebGPU performance wasn't on par yet).

A solid foundation is a place to build new things. We hope to see you building plenty!
