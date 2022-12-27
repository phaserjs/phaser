## Version 3.60.0 - Miku - in development

### New Features - Nine Slice Game Object

Phaser 3.60 contains a new native Nine Slice Game Object. A Nine Slice Game Object allows you to display a texture-based object that can be stretched both horizontally and vertically, but that retains fixed-sized corners. The dimensions of the corners are set via the parameters to the class. When you resize a Nine Slice Game Object only the middle sections of the texture stretch. This is extremely useful for UI and button-like elements, where you need them to expand to accommodate the content without distorting the texture.

The texture you provide for this Game Object should be based on the following layout structure:

```
    A                          B
  +---+----------------------+---+
C | 1 |          2           | 3 |
  +---+----------------------+---+
  |   |                      |   |
  | 4 |          5           | 6 |
  |   |                      |   |
  +---+----------------------+---+
D | 7 |          8           | 9 |
  +---+----------------------+---+
```

When changing this objects width and / or height:

    areas 1, 3, 7 and 9 (the corners) will remain unscaled
    areas 2 and 8 will be stretched horizontally only
    areas 4 and 6 will be stretched vertically only
    area 5 will be stretched both horizontally and vertically

You can also create a 3 slice Game Object:

This works in a similar way, except you can only stretch it horizontally. Therefore, it requires less configuration:

```
    A                          B
  +---+----------------------+---+
  |   |                      |   |
C | 1 |          2           | 3 |
  |   |                      |   |
  +---+----------------------+---+
```

When changing this objects width (you cannot change its height)

    areas 1 and 3 will remain unscaled
    area 2 will be stretched horizontally

The above configuration concept is adapted from the Pixi NineSlicePlane.

To specify a 3 slice object instead of a 9 slice you should only provide the `leftWidth` and `rightWidth` parameters. To create a 9 slice
you must supply all parameters.

The _minimum_ width this Game Object can be is the total of `leftWidth` + `rightWidth`.  The _minimum_ height this Game Object
can be is the total of `topHeight` + `bottomHeight`. If you need to display this object at a smaller size, you can scale it.

In terms of performance, using a 3 slice Game Object is the equivalent of having 3 Sprites in a row. Using a 9 slice Game Object is the equivalent
of having 9 Sprites in a row. The vertices of this object are all batched together and can co-exist with other Sprites and graphics on the display
list, without incurring any additional overhead.

As of Phaser 3.60 this Game Object is WebGL only. Please see the new examples and documentation for how to use it.

### New Features - Sprite FX

* When defining the `renderTargets` in a WebGL Pipeline config, you can now set optional `width` and `height` properties, which will create a Render Target of that exact size, ignoring the `scale` value (if also given).
* `WebGLPipeline.isSpriteFX` is a new boolean property that defines if the pipeline is a Sprite FX Pipeline, or not. The default is `false`.
* `GameObjects.Components.FX` is a new component that provides access to FX specific properties and methods. The Image and Sprite Game Objects have this component by default.
* `fxPadding` and its related method `setFXPadding` allow you to set extra padding to be added to the texture the Game Object renders with. This is especially useful for Sprite FX shaders that modify the sprite beyond its bounds, such as glow or shadow effects.
* The `WebGLPipeline.setShader` method has a new optional parameter `buffer` that allows you to set the vertex buffer to be bound before the shader is activated.
* The `WebGLPipeline.setVertexBuffer` method has a new optional parameter `buffer` that allows you to set the vertex buffer to be bound if you don't want to bind the default one.
* The `WebGLRenderer.createTextureFromSource` method has a new optional boolean parameter `forceClamp` that will for the clamp wrapping mode even if the texture is a power-of-two.
* `RenderTarget` will now automatically set the wrapping mode to clamp.
* `WebGLPipeline.flipProjectionMatrix` is a new method that allows you to flip the y and bottom projection matrix values via a parameter.
* `PipelineManager.renderTargets` is a new property that holds an array of `RenderTarget` objects that all `SpriteFX` pipelines can share, to keep texture memory as low as possible.
* `PipelineManager.maxDimension` is a new property that holds the largest possible target dimension.
* `PipelineManager.frameInc` is a new property that holds the amount the `RenderTarget`s will increase in size in each iteration. The default value is 32, meaning it will create targets of size 32, 64, 96, etc. You can control this via the pipeline config object.
* `PipelineManager.targetIndex` is a new property that holds the internal target array offset index. Treat it as read-only.
* The Pipeline Manager will now create a bunch of `RenderTarget` objects during its `boot` method. These are sized incrementally from 32px and up (use the `frameInc` value to alter this). These targets are shared by all Sprite FX Pipelines.
* `PipelineManager.getRenderTarget` is a new method that will return the a `RenderTarget` that best fits the dimensions given. This is typically called by Sprite FX Pipelines, rather than directly.
* `PipelineManager.getSwapRenderTarget` is a new method that will return a 'swap' `RenderTarget` that matches the size of the main target. This is called by Sprite FX pipelines and not typically called directly.
* `PipelineManager.getAltSwapRenderTarget` is a new method that will return a 'alternative swap' `RenderTarget` that matches the size of the main target. This is called by Sprite FX pipelines and not typically called directly.

### New Features - Compressed Texture Support

Phaser 3.60 contains support for Compressed Textures. It can parse both KTX and PVR containers and within those has support for the following formats: ETC, ETC1, ATC, ASTC, BPTC, RGTC, PVRTC, S3TC and S3TCSRB. Compressed Textures differ from normal textures in that their structure is optimized for fast GPU data reads and lower memory consumption. Popular tools that can create compressed textures include PVRTexTool, ASTC Encoder and Texture Packer.

Compressed Textures are loaded using the new `this.load.texture` method, which takes a texture configuration object that maps the formats to the files. The browser will then download the first file in the object that it knows it can support. You can also provide Texture Atlas JSON data, or Multi Atlas JSON data, too, so you can use compressed texture atlases. Currently, Texture Packer is the best tool for creating these type of files.

* `TextureSoure.compressionAlgorithm` is now populated with the compression format used by the texture.
* `Types.Textures.CompressedTextureData` is the new compressed texture configuration object type.
* `TextureManager.addCompressedTexture` is a new method that will add a compressed texture, and optionally atlas data into the Texture Manager and return a `Texture` object than any Sprite can use.
* `Textures.Parsers.KTXParser` is a new parser for the KTX compression container format.
* `Textures.Parsers.PVRParser` is a new parser for the PVR compression container format.
* The `WebGLRenderer.compression` property now holds a more in-depth object containing supported compression formats.
* The `WebGLRenderer.createTextureFromSource` method now accepts the `CompressedTextureData` data objects and creates WebGL textures from them.
* `WebGLRenderer.getCompressedTextures` is a new method that will populate the `WebGLRenderer.compression` object and return its value. This is called automatically when the renderer boots.
* `WebGLRenderer.getCompressedTextureName` is a new method that will return a compressed texture format GLenum based on the given format.

### Particle System Updates and New Features

#### New Features - Animated Particles

The Particle system has been given an overhaul to make it cleaner, more memory efficient and also introduces a great new feature: animated particles. The Particle class now has an instance of the `Animation State component within it. This allows a particle to play an animation when it is emitted, simply by defining it in the emitter config.

This will make each particle the 'Prism' animation:

```js
const emitter = particles.createEmitter({
    anim: 'prism'
    ...
});
```

You can also allow it to select a random animation by providing an array:

```js
const emitter = particles.createEmitter({
    anim: [ 'prism', 'square', 'ruby', 'square' ]
    ...
});
```

You've also the ability to cycle through the animations in order, so each new particle gets the next animation in the array:

```js
const emitter = particles.createEmitter({
    anim: { anims: [ 'prism', 'square', 'ruby', 'square' ], cycle: true }
    ...
});
```

Or even set a quantity. For example, this will emit 10 'prism' particles, then 10 'ruby' particles and then repeat:

```js
const emitter = particles.createEmitter({
    anim: { anims: [ 'prism', 'ruby' ], cycle: true, quantity: 10 }
    ...
});
```

The Animations must have already been created in the Global Animation Manager and must use the same texture as the one bound to the Particle Emitter. Aside from this, you can still control them in the same way as any other particle - scaling, tinting, rotation, alpha, lifespan, etc.

#### New Features - Fast Forward Particle Time

* You can now 'fast forward' a Particle Emitter. This can be done via either the emitter config, using the new `advance` property, or by calling the new `ParticleEmitter.fastForward` method. If, for example, you have an emitter that takes a few seconds to 'warm up' and get all the particles into position, this allows you to 'fast forward' the emitter to a given point in time. The value is given in ms. All standard emitter events and callbacks are still handled, but no rendering takes place during the fast-forward until it has completed.
* The `ParticleEmitter.start` method has a new optional parameter `advance` that allows you to fast-forward the given amount of ms before the emitter starts flowing.

#### New Features - Particle Interpolation

* It's now possible to create a new Interpolation EmitterOp. You do this by providing an array of values to interpolate between, along with the function name:

```js
const emitter = particles.createEmitter({
    x: { values: [ 50, 500, 200, 800 ], interpolation: 'catmull' }
    ...
});
```

This will interpolate the `x` property of each particle through the data set given, using a catmull rom interpolation function. You can also use `linear` or `bezier` functions. Interpolation can be combined with an `ease` type, which controls the progression through the time value. The related `EmitterOpInterpolationConfig` types have also been added.

#### New Features - Particle Emitter Duration

* The Particle Emitter config has a new optional parameter `duration`:

```js
const emitter = particles.createEmitter({
    speed: 24,
    lifespan: 1500,
    duration: 500
});
```

This parameter is used for 'flow' emitters only and controls how many milliseconds the emitter will run for before automatically turning itself off.

* `ParticleEmitter.duration` is a new property that contains the duration that the Emitter will emit particles for in flow mode.
* The `ParticleEmitter.start` method has a new optional parameter `duration`, which allows you to set the emitter duration when you call this method. If you do this, it will override any value set in the emitter configuration.
* The `ParticleEmitter.stop` method has a new optional parameter `kill`. If set it will kill all alive particles immediately, rather than leaving them to die after their lifespan expires.

#### New Features - Stop After a set number of Particles

* The Particle Emitter config has a new optional `stopAfter` property. This, combined with the `frequency` property allows you to control exactly how many particles are emitted before the emitter then stops:

```js
const emitter = particles.createEmitter({
    x: { start: 400, end: 0 },
    y: { start: 300, end: 0 },
    lifespan: 3000,
    frequency: 250,
    stopAfter: 6,
    quantity: 1
});
```

In the above code the emitter will launch 1 particle (set by the `quantity` property) every 250 ms (set by the `frequency` property) and move it to xy 0x0. Once it has fired 6 particles (the `stopAfter` property) the emitter will stop and emit the `COMPLETE` event.

* The `stopAfter` counter is reset each time you call the `start` or `flow` methods.

#### New Features - Particle Emitter Events

* The Particle Emitter will now fires new events. Please note that these events are emitted by the Particle Emitter Manager, not the Emitter itself (as the Emitter does not have an EventEmitter component and cannot have one). Therefore, listen for the events as follows:

```js
const emitterManager = this.add.particles('flare');

//  Create your emitters

emitterManager.on('emitterstart', (emitter) => {
    //  emission started
});

emitterManager.on('emitterexplode', (emitter, particle) => {
    //  emitter 'explode' called
});

emitterManager.on('emitterstop', (emitter) => {
    //  emission has stopped
});

emitterManager.on('emittercomplete', (emitter) => {
    //  all particles fully dead
});
```

* The `Particles.Events.START` event is fired whenever the Emitter begins emission of particles in flow mode. A reference to the `ParticleEmitter` is included as the only parameter.
* The `Particles.Events.EXPLODE` event is fired whenever the Emitter explodes a bunch of particles via the `explode` method. A reference to the `ParticleEmitter` and a reference to the most recently fired `Particle` instance are the two parameters.
* The `Particles.Events.STOP` event is fired whenever the Emitter finishes emission of particles in flow mode. This happens either when you call the `stop` method, or when an Emitter hits its duration  or stopAfter limit. A reference to the `ParticleEmitter` is included as the only parameter.
* The `Particles.Events.COMPLETE` event is fired when the final alive particle expires.

#### Particle System EmitterOp Breaking Changes and Updates:

All of the following properties have been replaced on the `ParticleEmitter` class. Previously they were `EmitterOp` instances. They are now public getter / setters, so calling, for example, `emitter.x` will now return a numeric value - whereas before it would return the `EmitterOp` instance. This gives developers a lot more freedom when using Particle Emitters. Before v3.60 it was impossible to do this, for example:

```js
this.tweens.add({
    targets: emitter,
    x: 400
});
```

I.e. you couldn't tween an emitters position by directly accessing its x and y properties. However, now that all EmitterOps are getters, you're free to do this, allowing you to be much more creative and giving a nice quality-of-life improvement.

If, however, your code used to access EmitterOps, you'll need to change it as follows:

```js
//  Phaser 3.55
emitter.x.onChange(value)
//  Phaser 3.60
emitter.x = value

//  Phaser 3.55
let x = emitter.x.propertyValue
//  Phaser 3.60
let x = emitter.x

//  Phaser 3.55
emitter.x.onEmit()
emitter.x.onUpdate()
//  Phaser 3.60
emitter.ops.x.onEmit()
emitter.ops.x.onUpdate()
```

All of following EmitterOp functions can now be found in the new `ParticleEmitter.ops` property and have been replaced with getters:

* accelerationX
* accelerationY
* angle
* alpha
* bounce
* delay
* lifespan
* maxVelocityX
* maxVelocityY
* moveToX
* moveToY
* quantity
* rotate
* scaleX
* scaleY
* speedX
* speedY
* tint
* x
* y

Which means you can now directly access, modify and tween any of the above emitter properties at run-time while the emitter is active.

Another potentially breaking change is the removal of two internal private counters. These should never have been used directly anyway, but they are:

* `ParticleEmitter._counter` - Now available via `ParticleEmitter.counters[0]`
* `ParticleEmitter._frameCounter` - Now available via `ParticleEmitter.counters[1]`

#### Further Particle System Updates and Fixes:

* Setting `frequency` wasn't working correctly in earlier versions. It should allow you to specify a time, in ms, between which each 'quantity' of particles is emitted. However, the `preUpdate` loop was calculating the value incorrectly. It will now count down the right amount of time before emiting another batch of particles.
* Calling `ParticleEmitter.start` wouldn't reset the `_frameCounter` value internally, meaning the new emission didn't restart from the first texture frame again.
* `ParticleEmitter.counters` is a new Float32Array property that is used to hold all of the various internal counters required for emitter operation. Both the previous `_counter` and `_frameCounter` properties have been merged into this array, along with new ones required for new features.
* The WebGL Renderer will now use the new `setQuad` feature of the Transform Matrix. This vastly reduces the amount of math and function calls per particle, from 8 down to 1, increasing performance.
* Particles with a scaleX or scaleY value of zero will no longer be rendered.
* `ParticleEmitterManager.preDestroy` is a new method that will now clean-up all Emitters and Gravity Wells that it created  and clear some internal arerays.
* `ParticleEmitter.destroy` is a new method that will destroy all Particles that the Emitter owns and clean-up all external references.
* `Particle.destroy` is a new method that will clean up all external references and destroy the Animation State controller.
* The `ParticleEmitter._frameLength` property is now specified on the class, rather than added dynamically at run-time, helping preserve class shape.
* The `ParticleEmitterManager.defaultFrame` property is now specified on the class, rather than added dynamically at run-time, helping preserve class shape.
* The `ParticleEmitterManager.preUpdate` method no longer runs if the manager is paused.
* Calling `ParticleEmitter.setFrame` no longer resets the internal `_frameCounter` value to zero. Instead, the counter comparison has been hardened to `>=` instead of `===` to allow this value to change mid-emission and never reach the total.
* The `ParticleEmitter.configFastMap` property has been moved to a local var within the `ParticleEmitter` JS file. It didn't need to be a property on the class itself, reducing the overall size of the class and saving memory.
* The `ParticleEmitter.configOpMap` property has been moved to a local var within the `ParticleEmitter` JS file. It didn't need to be a property on the class itself, reducing the overall size of the class and saving memory.
* `Particle.scene` is a new property that references the Scene the Particle Emitter belongs to.
* `Particle.anims` is a new property that is an instance of the `AnimationState` component.
* `Particle.emit` is a new proxy method that passes all Animation related events through to the Particle Emitter Manager to emit, as Particles cannot emit events directly.
* `Particle.isCropped` is a new read-only property. Do not modify.
* `Particle.setSizeToFrame` is a new internal NOOP method. Do not call.
* `ParticleEmitter.anims` is a new property that contains the Animation keys that can be assigned to Particles.
* `ParticleEmitter.defaultAnim` is a new property that contains default animation to play when one isn't specified directly.
* `ParticleEmitter.currentAnim` is a new property that contains the index of the current animation, as tracked in cycle playback.
* `ParticleEmitter.random` is a new boolean property that controls if the animations are selected randomly, or in a cycle.
* `ParticleEmitter.animQuantity` is a new property that controls the number of consecutive particles that are emitted with the current animation.
* `ParticleEmitter._animCounter` and `_animLength` are new internal private properties used for animation handling.
* `ParticleEmitter.getAnim` is a new method, called by Particles when they are emitted, that will return the animation to use, if any.
* `ParticleEmitter.setAnim` is a new method, called with the Emitter Manager, that sets the animation data into the Emitter.
* `ParticleEmitterManager.animNames` is a new property that contains the names of all animations playable based on the Emitters texture. This is populated in the `setFrame` method.
* `ParticleEmitterManager.setEmitterAnims` is a new method that is called by child Emitters in order to set the animation data they need.
* The `Particles.EmitterOp.toJSON` method will now JSON stringify the property value before returning it.
* `Particles.EmitterOp.method` is a new property that holds the current operation method being used. This is a read-only numeric value.
* `Particles.EmitterOp.active` is a new boolean property that defines if the operator is alive, or not. This is now used by the Emitter instead of nulling Emitter properties, helping maintain class shape.
* `Particles.EmitterOp.getMethod` is a new internal method that returns the operation function being used as a numeric value. This is then cached in the `method` property.
* The `Particles.EmitterOp.setMethods` method has been updated so it now has a non-optional 'method' parameter. It has also been rewritten to be much more efficient, now being just a single simple select/case block.
* The `Particles.EmitterOp.onChange` method will now use the cached 'method' property to avoid running through the `setMethods` function if not required, allowing each Particle EmitterOp to skip a huge chunk of code.
* We've also greatly improved the documentation around the Particle classes.

### New Features - Vastly Improved Mobile Performance and WebGL Pipeline Changes

TODO

#### WebGL Renderer Updates

Due to all of the changes with how WebGL texture batching works a lot of mostly internal methods and properties have been removed. This is the complete list:

* The `WebGLRenderer.currentActiveTexture` property has been removed.
* The `WebGLRenderer.startActiveTexture` property has been removed.
* The `WebGLRenderer.tempTextures` property has been removed.
* The `WebGLRenderer.textureZero` property has been removed.
* The `WebGLRenderer.normalTexture` property has been removed.
* The `WebGLRenderer.textueFlush` property has been removed.
* The `WebGLRenderer.isTextureClean` property has been removed.
* The `WebGLRenderer.setBlankTexture` method has been removed.
* The `WebGLRenderer.setTextureSource` method has been removed.
* The `WebGLRenderer.isNewNormalMap` method has been removed.
* The `WebGLRenderer.setTextureZero` method has been removed.
* The `WebGLRenderer.clearTextureZero` method has been removed.
* The `WebGLRenderer.setNormalMap` method has been removed.
* The `WebGLRenderer.clearNormalMap` method has been removed.
* The `WebGLRenderer.unbindTextures` method has been removed.
* The `WebGLRenderer.resetTextures` method has been removed.
* The `WebGLRenderer.setTexture2D` method has been removed.
* The `WebGLRenderer.pushFramebuffer` method has had the `resetTextures` argument removed.
* The `WebGLRenderer.setFramebuffer` method has had the `resetTextures` argument removed.
* The `WebGLRenderer.popFramebuffer` method has had the `resetTextures` argument removed.
* The `WebGLRenderer.deleteTexture` method has had the `reset` argument removed.
* The `Textures.TextureSource.glIndex` property has been removed.
* The `Textures.TextureSource.glIndexCounter` property has been removed.

Previously, `WebGLRenderer.whiteTexture` and `WebGLRenderer.blankTexture` had a data-type of `WebGLTexture` but they were actually `Phaser.Textures.Frame` instances. This has now been corrected and the two properties are now actually `WebGLTexture` instances, not Frames. If your code relies on this mistake being present, please adapt it.

* The `RenderTarget` class will now create a Framebuffer that includes a Depth Stencil Buffer attachment by default. Previously, it didn't. By attaching a stencil buffer it allows things like Geometry Masks to work in combination with Post FX and other Pipelines. Fix #5802 (thanks @mijinc0)
* When calling `PipelineManager.clear` and `rebind` it will now check if the vao extension is available, and if so, it'll bind a null vertex array. This helps clean-up from 3rd party libs that don't do this directly, such as ThreeJS.

#### Mobile Pipeline

* The Mobile Pipeline is a new pipeline that extends the Multi Tint pipeline, but uses customized shaders and a single-bound texture specifically for mobile GPUs. This should restore mobile performance back to the levels it was around v3.22, before Multi Tint improved it all for desktop at the expense of mobile.
* `shaders/Mobile.vert` and `shaders/Mobile.frag` are the two shaders used for the Mobile Pipeline.
* `PipelineManager#MOBILE_PIPELINE` is a new constant-style reference to the Mobile Pipeline instance.
* `autoMobilePipeline` is a new Game Configuration boolean that toggles if the Mobile Pipeline should be automatically deployed, or not. By default it is enabled, but you can set it to `false` to force use of the Multi Tint pipeline (or if you need more advanced conditions to check when to enable it)
* `defaultPipeline` is a new Game Configuration property that allows you to set the default Game Object Pipeline. This is set to Multi Tint as standard, but you can set it to your own pipeline from this value.
* `PipelineManager.default` is a new propery that is used by most Game Objects to determine which pipeline they will init with.
* `PipelineManager.setDefaultPipeline` is a new method that allows you to change the default Game Object pipeline. You could use this to allow for more fine-grained conditional control over when to use Multi or Mobile (or another pipeline)
* The `PipelineManager.boot` method is now passed the default pipeline and auto mobile setting from the Game Config.

#### Multi Tint Pipeline

* The `batchLine` method in the Multi Pipeline will now check to see if the dxdy len is zero, and if so, it will abort drawing the line. This fixes issues on older Android devices, such as the Samsung Galaxy S6 or Kindle 7, where it would draw erroneous lines leading up to the top-left of the canvas under WebGL when rendering a stroked rounded rectangle. Fix #5429 (thanks @fkoch-tgm @sreadixl)
* The `Multi.frag` shader now uses a `highp` precision, or `mediump` if the device doesn't support it (thanks @arbassic)
* The `WebGL.Utils.checkShaderMax` function will no longer use a massive if/else glsl shader check and will instead rely on the value given in `gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS)`.
* The internal WebGL Utils function `GenerateSrc` has been removed as it's no longer required internally.
* Previously, the Multi Tint methods `batchSprite`, `batchTexture`, `batchTextureFrame` and `batchFillRect` would all make heavy use of the `TransformMatrix.getXRound` and `getYRound` methods, which in turn called `getX` and `getY` and applied optional rounding to them. This is all now handled by one single function (`setQuad`) with no branching, meaning rendering one single sprite has cut down 16 function calls and 48 getters to just 1 function.

#### Lights Pipeline

* The Light fragment shader will now use the `outTintEffect` attribute meaning the Light Pipeline will now correctly light both tinted and fill-tinted Game Objects. Fix #5452 (thanks @kainage)
* The Light Pipeline will now check to see if a Light2D enabled Game Object has a parent Container, or not, and factor the rotation and scale of this into the light calculation. Fix #6086 (thanks @irongaze)
* The Light Pipeline no longer creates up to `maxLights` copies of the Light shader on boot. Previously it would then pick which shader to use, based on the number of visible lights in the Scene. Now, the number of lights is passed to the shader and branches accordingly. This means rather than compiling _n_ shaders on boot, it now only ever needs to create one.
* You can now have no lights in a Scene, but the Scene will still be impacted by the ambient light. Previously, you always needed at least 1 light to trigger ambient light (thanks jstnldrs)
* The `Light.frag` shader now uses a new `uLightCount` uniform to know when to stop iterating through the max lights.
* The `LightPipeline.LIGHT_COUNT` constant has been removed as it's not used internally.
* The `LightPipeline` previous created a global level temporary vec2 for calculations. This is now part of the class as the new `tempVec2` property.

#### Removed - Graphics Pipeline

The WebGL Graphics Pipeline has been removed. This pipeline wasn't used in v3.55, as all Graphics rendering is handled by the MultiTint pipeline, for better batching support. No Phaser Game Objects use the Graphics pipeline any longer, so to save space it has been removed and is no longer installed by the Pipeline Manager.

### New Features - Matter Physics v0.18

We have updated the version of Matter Physics to the latest v0.18 release. This is a big jump and brings with it quite a few internal changes to Matter. The following are the differences we have identified in this release:

* Up to ~40% performance improvement (on average measured over all examples, in Node on a Mac Air M1)
* Replaces `Matter.Grid` with a faster and more efficient broadphase in `Matter.Detector`.
* Reduced memory usage and garbage collection.
* Resolves issues in `Matter.SAT` related to collision reuse.
* Removes performance issues from `Matter.Grid`.
* Improved collision accuracy.
* `MatterPhysics.collision` is a new reference to the `Collision` module, which now handles all Matter collision events.
* `MatterPhysics.grid` has been removed as this is now handled by the `Collision` module.
* `MatterPhysics.sat` has been removed as this is now handled by the `Collision` module.
* The `Matter.Body.previousPositionImpulse` property has been removed as it's no longer used.

### New Features - New Tween Manager

TODO - TweenData to class
TODO - TweenData and Tween State methods
TODO - CONST removals

The Phaser 3.60 Tween system has been rewritten to help with performance, resolve some of its lingering issues and unifies the Tween events and callbacks.

The following are breaking changes:

* Tween Timelines have been removed entirely. Due to the way they were implemented they tended to cause a range of esoteric timing bugs which were non-trivial to resolve. To that end, we made the decision to remove Timelines entirely and introduced the ability to chain tweens together using the new `chain` method. This should give most developers the same level of sequencing they had using Timelines, without the timing issues.
* The `Tween.seek` method used to take a value between 0 and 1, based on how far through the Tween you wished to seek. However, it did not work with infinitely looping or repeating Tweens and would crash the browser tab. The new `seek` method takes a value in milliseconds instead and works perfectly on infinite Tweens.
* When creating a Tween, you can no longer pass a function for the following properties: `duration`, `hold`, `repeat` and `repeatDelay`. These should be numbers only. You can, however, still provide a function for `delay`, to keep it compatible with the StaggerBuilder.
* The `TweenManager#getAllTweens` method has been renamed to `TweenManager#getTweens`. Functionally, it is the same.
* The property and feature `Tween.useFrames` has been removed and is no longer a valid Tween Config option. Tweens are now entirely millisecond based.
* The `TweenOnUpdateCallback` now has the following parameters: `tween`, `targets`, `key` (the property being tweened), `current` (the current value of the property), `previous` (the previous value of the property) and finally any of the params that were passed in the `onUpdateParams` array when the Tween was created.
* The `TweenOnYoyoCallback` now has the following parameters: `tween`, `targets`, `key` (the property being tweened), `current` (the current value of the property), `previous` (the previous value of the property) and finally any of the params that were passed in the `onYoyoParams` array when the Tween was created.
* The `TweenOnRepeatCallback` now has the following parameters: `tween`, `targets`, `key` (the property being tweened), `current` (the current value of the property), `previous` (the previous value of the property) and finally any of the params that were passed in the `onRepeatParams` array when the Tween was created.
* `Tween.stop` has had the `resetTo` parameter removed from it. Calling `stop` on a Tween will now prepare the tween for immediate destruction. If you only wish to pause the tween, see `Tween.pause` instead.
* Tweens will now be automatically destroyed by the Tween Manager upon completion. This helps massively in reducing stale references and memory consumption. However, if you require your Tween to live-on, even after playback, then you can now specify a new `persists` boolean flag when creating it, or toggle the `Tween.persist` property before playback. This will force the Tween to _not_ be destroyed by the Tween Manager, allowing you to replay it at any later point. The trade-off is that _you_ are now entirely responsible for destroying the Tween when you are finished with it, in order to free-up resources.
* All of the 'Scope' tween configuration callback properties have been removed, including `onActiveScope`, `onCompleteScope`, `onLoopScope`, `onPauseScope`, `onRepeatScope`, `onResumeScope`, `onStartScope`, `onStopScope`, `onUpdateScope` and `onYoyoScope`. You should set the `callbackScope` property instead, which will globally set the scope for all callbacks. You can also set the `Tween.callbackScope` property.

The following are to do with the new Chained Tweens feature:

* `TweenManager.chain` - TODO

* `Tween.getChainedTweens` is a new method that will return all of the tweens in a chained sequence, starting from the point of the Tween this is called on.
* `TweenManager.getChainedTweens(tween)` is a new method that will return all of the tweens in a chained sequence, starting from the given tween.
* You can now specify a target property as 'random' to have the Tween pick a random float between two given values, for example: `alpha: 'random(0.25, 0.75)'`. If you wish to force it to select a random integer, use 'int' instead: `x: 'int(300, 600)'`.

The following are further updates within the Tween system:

* `TweenManager.add` and `TweenManager.create` can now optionally take an array of Tween Configuration objects. Each Tween will be created, added to the Tween Manager and then returned in an array. You can still pass in a single config if you wish.
* `Tween.pause` is a new method that allows you to pause a Tween. This will emit the PAUSE event and, if set, fire the `onPause` callback.
* `Tween.resume` is a new method that allows you to resume a paused Tween. This will emit the RESUME event and, if set, fire the `onResume` callback.
* There is a new `TweenOnPauseCallback` available when creating a Tween (via the `onPause` property). This comes with associated `onPauseParams` and `onPauseScope` properties, too, like all other callbacks and can also be added via the `Tween.setCallbacks` method. This callback is invoked if you pause the Tween.
* There is a new `TweenOnResumeCallback` available when creating a Tween (via the `onResume` property). This comes with associated `onResumeParams` and `onResumeScope` properties, too, like all other callbacks and can also be added via the `Tween.setCallbacks` method. This callback is invoked if you resume a previously paused Tween.
* The property value of a Tween can now be an array, i.e. `x: [ 100, 300, 200, 600 ]` in which case the Tween will use interpolation to determine the value.
* You can now specify an `interpolation` property in the Tween config to set which interpolation method the Tween will use if an array of numeric values have been given as the tween value. Valid values includes `linear`, `bezier` and `catmull` (or `catmullrom`), or you can provide your own function to use.
* You can now specify a `scale` property in a Tween config and, if the target _does not_ have a `scale` property itself (i.e. a GameObject) then it will automatically apply the value to both `scaleX` and `scaleY` together during the tween. This is a nice short-cut way to tween the scale of Game Objects by only specifying one property, instead of two.
* `killTweensOf(targets)` now supports deeply-nested arrays of items as the `target` parameter. Fix #6016 (thanks @michalfialadev)
* `killTweensOf(target)` did not stop target tweens if called immediately after tween creation. Fix #6173 (thanks @michalfialadev)
* It wasn't possible to resume a Tween that was immediately paused after creation. Fix #6169 (thanks @trynx)
* Calling `Tween.setCallback()` without specifying the `params` argument would cause an error invoking the callback params. This parameter is now fully optional. Fix #6047 (thanks @orcomarcio)
* Calling `Tween.play` immediately after creating a tween with `paused: true` in the config wouldn't start playback. Fix #6005 (thanks @MartinEyebab)
* Fixed an issue where neither Tweens or Timelines would factor in the Tween Manager `timeScale` value unless they were using frame-based timing instead of delta timing.
* The first parameter to `Tween.seek`, `toPosition` now defaults to zero. Previously, you had to specify a value.
* The `TweenBuilder` now uses the new `GetInterpolationFunction` function internally.
* The `TweenBuilder` has been optimized to perform far less functions when creating the TweenData instances.
* The keyword `interpolation` has been added to the Reserved Words list and Defaults list (it defaults to `null`).
* The keyword `persists` has been added to the Reserved Words list and Defaults list (it defaults to `false`).
* `Tween.initTweenData` is a new method that handles the initialisation of all the Tween Data and Tween values. This replaces what took place in the `init` and `seek` methods previously. This is called automatically and should not usually be invoked directly.
* The internal `Tween.calcDuration` method has been removed. This is now handled as part of the `initTweenData` call.
* Fixed a bug where setting `repeat` and `hold` would cause the Tween to include one final hold before marking itself as complete. It now completes as soon as the final repeat concludes, not after an addition hold.

### New Features - Dynamic Textures and Render Textures

A Dynamic Texture is a special texture that allows you to draw textures, frames and most kind of Game Objects directly to it.

You can take many complex objects and draw them to this one texture, which can then be used as the base texture for other Game Objects, such as Sprites. Should you then update this texture, all Game Objects using it will instantly be updated as well, reflecting the changes immediately.

It's a powerful way to generate dynamic textures at run-time that are WebGL friendly and don't invoke expensive GPU uploads on each change.

Before Phaser 3.60 this was known as a Render Texture. Dynamic Textures have been optimized and also offer the following new features and updates. All of these are also available to the new Render Texture, via the `texture` property:

* `TextureManager.addDynamicTexture(key, width, height)` is a new method that will create a Dynamic Texture and store it in the Texture Manager, available globally for use by any Game Object.
* Unlike the old Render Texture, Dynamic Texture extends the native `Phaser.Texture` class, meaning you can use it for any texture based object and also call all of the native Texture methods, such as the ability to add frames to it, use it as the backing source for a sprite sheet or atlas, and more.
* Dynamic Textures no longer create both Render Targets _and_ Canvas objects, only the one that they require based on the renderer. This means Render Textures and Dynamic Textures now use 50% less memory under WebGL and don't create Canvas DOM elements.
* You can now directly use a Dynamic Texture as the source for a Bitmap Mask.
* Game Objects that have a mask will now reflect this when drawn to a Dynamic Texture.
* `DynamicTexture.isDrawing` is a new boolean that allows you to tell if a batch draw has been started and is in process.
* `DynamicTexture.isSpriteTexture` is a new boolean that informs the texture if it is being used as a backing texture for Sprite Game Objects, or not. If it is (which is the default) then items drawn to the texture are automatically inversed. Doing this ensures that images drawn to the Render Texture are correctly inverted for rendering in WebGL. Not doing so can cause inverted frames. If you use this method, you must use it before drawing anything to the Render Texture. Fix #6057 #6017 (thanks @andymikulski @Grandnainconnu)
* `DynamicTexture.setIsSpriteTexture` is a new method that allows you to toggle the `isSpriteTexture` property in a chained manner.
* `DynamicTexture.renderTarget` is a new property that holds an instance of a RenderTarget under WebGL. This encompasses a framebuffer and backing texture, rather than having them split.
* `DynamicTexture.stamp` is a new method that takes a given texture key and then stamps it at the x/y coordinates provided. You can also pass in a config object that gives a lot more control, such as alpha, tint, angle, scale and origin of the stamp. This is a much cleaner way of stamping a texture to the DynamicTexture without having to first turn it into a Game Object.
* `DynamicTexture.repeat` is a new method that will take a given texture and draw it to the Dynamic Texture as a fill-pattern. You can control the offset, width, height, alpha and tint of the draw (thanks xlapiz)
* `batchGameObject` now splits based on the renderer, allowing us to combine lots of the rendering code together, saving space.
* The `snapshot` and `snapshotPixel` methods now use the `snapshotArea` method to reduce code and filesize.
* The `snapshotPixel` function, used by the Canvas and WebGL Renderers and the RenderTexture would mistakenly divide the alpha value. These values now return correctly (thanks @samme)
* `DynamicTexture.batchTextureFrame` will now skip the `drawImage` call in canvas if the frame width or height are zero. Fix #5951 (thanks @Hoshinokoe)
* Using `DynamicTexture.fill` in CANVAS mode only would produce a nearly always black color due to float conversion (thanks @andymikulski)
* Using `DynamicTexture.fill` in CANVAS mode only, after using the `erase` method, wouldn't reset the global composite operation correctly, resulting in fills. Fix #6124 (thanks @mateuszkmiecik)
* Drawing a frame via `draw`, `drawFrame` or `batchDrawFrame` and specifying a `tint` value would inverse the Red and Blue channels. These are now handled properly. Fix #5509 (thanks @anthonygood)

Due to the creation of the Dynamic Texture class, we have completely revamped the old Render Texture Game Object. This is now a combination of a Dynamic Texture and an Image Game Object, that uses the Dynamic Texture to display itself with.

In versions of Phaser before 3.60 a Render Texture was the only way you could create a texture like this, that had the ability to be drawn on. But in 3.60 we split the core functions out to the Dynamic Texture class as it made a lot more sense for them to reside in there. As a result, the Render Texture is now a light-weight shim that sits on-top of an Image Game Object and offers proxy methods to the features available from a Dynamic Texture.

Render Texture breaking changes:

* Render Textures used to be able to take `key` and `frame` arguments in their constructors, which would take the texture from the Texture Manager and use that instance, instead of creating a new one. Because Dynamic Textures are always stored in the Texture Manager from the beginning, there is no need to specify these arguments. You can just get it from the Texture Manager by using its key.

* The following `RenderTexture` properties have changed:

* `renderer` is now available via `texture.renderer`.
* `textureManager` has been removed.
* `globalTint` has been removed.
* `globalAlpha` has been removed.
* `canvas` is now available via `texture.canvas`.
* `context` is now available via `texture.context`.
* `dirty` is now available via `texture.dirty`.
* `camera` is now available via `texture.camera`.
* `renderTarget` is now available via `texture.renderTarget`.
* `origin` is now (0.5, 0.5) by default instead of (0, 0).

* The following `RenderTexture` methods have changed:

* `drawGameObject` has been removed, this is now handled by the batch methods.
* `resize` has been renamed. Use `setSize(width, height)` instead.
* `setGlobalTint` has been removed as it's no longer used internally.
* `setGlobalAlpha` has been removed as it's no longer used internally.
* `batchGameObjectWebGL` has been removed, now handled by `batchGameObject`.
* `batchGameObjectCanvas` has been removed, now handled by `batchGameObject`.

**When should you use a Render Texture vs. a Dynamic Texture?**

You should use a Dynamic Texture if the texture is going to be used by multiple Game Objects, or you want to use it across multiple Scenes, because textures are globally stored.

You should use a Dynamic Texture if the texture isn't going to be displayed in-game, but is instead going to be used for something like a mask or shader.

You should use a Render Texture if you need to display the texture in-game on a single Game Object, as it provides the convenience of wrapping an Image and Dynamic Texture together for you.

### Input System Updates

There are breaking changes from previous versions of Phaser.

* The `InteractiveObject.alwaysEnabled` property has been removed. It is no longer checked within the `InputPlugin` and setting it will have no effect. This property has not worked correctly since version 3.52 when the new render list was implemented. Upon further investigation we decided to remove the property entirely, rather than shoe-horn it into the render list. If you need to create a non-rendering Interactive area, use the Zone Game Object instead.

### Bitmap Mask Updates

There are breaking changes from previous versions of Phaser.

* Previously, every unique Bitmap Mask would create two full renderer sized framebuffers and two corresponding WebGL textures for them. The Bitmap Mask would listen for resize events from the renderer and then re-create these framebuffers accordingly. However, as the Bitmap Mask pipeline would clear and re-render these framebuffers every single frame it made no sense to have them use such large amounts of GPU memory. As of 3.60, the WebGL Renderer creates and manages two RenderTargets which all Bitmap Masks now use. If you previously used multiple Bitmap Masks in your game this change will dramatically reduce memory consumption at no performance cost.
* The Bitmap Mask constructor is now capable of creating an Image Game Object from the new optional arguments: `x, y, texture, frame` if no masked object is provided.
* The Bitmap Mask now registers itself with the Game Object Factory. This means you can do `this.add.bitmapMask()` from within a Scene, for easier creation.
* Due to the change in ownership of the framebuffers, the following properties have been removed from the BitmapMask class: `renderer`, `maskTexture`, `mainTexture`, `dirty`, `mainFramebuffer` and `maskFramebuffer`. The following methods have also been removed: `createMask` and `clearMask`.
* The `WebGLRenderer` has 2 new properties: `maskSource` and `maskTarget`. These are the new global mask framebuffers.
* `WebGLRenderer.beginBitmapMask` is a new method that starts the process of using the mask target framebuffer for drawing. This is called by the `BitmapMaskPipeline`.
* `WebGLRenderer.drawBitmapMask` is a new method that completes the process of rendering using the mask target framebuffer. This is called by the `BitmapMaskPipeline`.
* The `BitmapMaskPipeline` now hands over most control of the framebuffers to the WebGLRenderer.
* The `GameObjects.Components.Mask.createBitmapMask` method can now accept the `x`, `y`, `texture` and `frame` parameters new to the BitmapMask constructor.
* Previously, calling `createBitmapMask` on a Shape Game Object would fail unless you passed the shape to the method. Now, it will correctly create a mask from the Shape without needing to pass it. Fix #5976 (thanks @samme)

### TimeStep Updates

* You can now enforce an FPS rate on your game by setting the `fps: { limit: 30 }` value in your game config. In this case, it will set an fps rate of 30. This forces Phaser to not run the game step more than 30 times per second (or whatever value you set) and works for both Request Animation Frame and SetTimeOut.
* `TimeStep._limitRate` is a new internal private property allowing the Timestep to keep track of fps-limited steps.
* `TimeStep.hasFpsLimit` is a new internal boolean so the Timestep knows if the step is fps rate limited, or not.
* There is now a `TimeStep.step` method and `TimeStep.setLimitFPS` method. Which one is called depends on if you have fps limited your game, or not. This switch is made internally, automatically.
* `TimeStep.smoothDelta` is a new method that encapsulates the delta smoothing.
* `TimeStep.updateFPS` is a new method that calculates the moving frame rate average.
* `TimeStep.wake` will now automatically reset the fps limits and internal update counters.
* `TimeStep.destroy` will now call `RequestAnimationFrame.destroy`, properly cleaning it down.
* `RequestAnimationFrame.step` will now no longer call `requestAnimationFrame` if `isRunning` has been set to `false` (via the `stop` method)
* The `TimeStep` no longer calculates or passes the `interpolation` value to Game.step as it was removed several versions ago, so is redundant.
* The `RequestAnimationFrame.tick` property has been removed as it's no longer used internally.
* The `RequestAnimationFrame.lastTime` property has been removed as it's no longer used internally.
* The `RequestAnimationFrame` class no longer calculates the tick or lastTime values and doesn't call `performance.now` as these values were never used internally and were not used by the receiving callback either.
* The `RequestAnimationFrame.target` property has been renamed to `delay` to better describe what it does.
* The TimeStep would always allocate 1 more entry than the `deltaSmoothingMax` value set in the game config. This is now clamped correctly (thanks @vzhou842)

### New Features

* The `Graphics.strokeRoundedRect` and `fillRoundedRect` methods can now accept negative values for the corner radius settings, in which case a concave corner is drawn instead (thanks @rexrainbow)
* `AnimationManager.getAnimsFromTexture` is a new method that will return all global Animations, as stored in the Animation Manager, that have at least one frame using the given Texture. This will not include animations created directly on local Sprites.
* `BitmapText.setLineSpacing` is a new method that allows you to set the vertical spacing between lines in multi-line BitmapText Game Objects. It works in the same was as spacing for Text objects and the spacing value can be positive or negative. See also `BitmapText.lineSpacing` for the property rather than the method.
* `WebGLPipeline.vertexAvailable` is a new method that returns the number of vertices that can be added to the current batch before it will trigger a flush.
* The `Tilemap` and `TilemapLayer` classes have a new method `getTileCorners`. This method will return an array of Vector2s with each entry corresponding to the corners of the requested tile, in world space. This currently works for Orthographic and Hexagonal tilemaps.
* `BaseSoundManager.getAllPlaying` is a new method that will return all currently playing sounds in the Sound Manager.
* `Animation.showBeforeDelay` is a new optional boolean property you can set when creating, or playing an animation. If the animation has a delay before playback starts this controls if it should still set the first frame immediately, or after the delay has expired (the default).
* `InputPlugin.resetPointers` is a new method that will loop through all of the Input Manager Pointer instances and reset them all. This is useful if a 3rd party component, such as Vue, has stolen input from Phaser and you need to reset its input state again.
* `Pointer.reset` is a new method that will reset a Pointer instance back to its 'factory' settings.
* When using `Group.createMultiple` it will now skip the post-creations options if they are not set in the config object used, or a Game Object constructor. Previously, things like alpha, position, etc would be over-written by the defaults if they weren't given in the config, but now the method will check to see if they are set and only use them if they are. This is a breaking change, but makes it more efficient and flexible (thanks @samme)
* When running a Scene transition there is a new optional callback `onStart`, which is passed the parameters `fromScene`, `toScene` and `duration` allowing you to consolidate transition logic into a single callback, rather than split across the start and end events (thanks @rexrainbow)
* `TextureManager.silentWarnings` is a new boolean property that, when set, will prevent the Texture Manager from emiting any warnings or errors to the console in the case of missing texture keys or invalid texture access. The default is to display these warnings, this flag toggles that.
* `TextureManager.parseFrame` is a new method that will return a Texture Frame instance from the given argument, which can be a string, array, object or Texture instance.
* `GameConfig.stableSort` and `Device.features.stableSort` is a new property that will control if the internal depth sorting routine uses our own StableSort function, or the built-in browser `Array.sort`. Only modern browsers have a _stable_ `Array.sort` implementation, which Phaser requires. Older ones need to use our function instead. Set to 0 to use the legacy version, 1 to use the ES2019 version or -1 to have Phaser try and detect which is best for the browser (thanks @JernejHabjan)
* `Device.es2019` is a new boolean that will do a basic browser type + version detection to see if it supports ES2019 features natively, such as stable array sorting.
* All of the following Texture Manager methods will now allow you to pass in a Phaser Texture as the `source` parameter: `addSpriteSheet`, `addAtlas`, `addAtlasJSONArray`, `addAtlasJSONHash`, `addAtlasXML` and `addAtlasUnity`. This allows you to add sprite sheet or atlas data to existing textures, or textures that came from external sources, such as SVG files, canvas elements or Dynamic Textures.
* `Game.pause` is a new method that will pause the entire game and all Phaser systems.
* `Game.resume` is a new method that will resume the entire game and resume all of Phaser's systems.
* `ScaleManager.getViewPort` is a new method that will return a Rectangle geometry object that matches the visible area of the screen, or the given Camera instance (thanks @rexrainbow)
* When starting a Scene and using an invalid key, Phaser will now raise a console warning informing you of this, instead of silently failing. Fix #5811 (thanks @ubershmekel)
* `GameObjects.Layer.addToDisplayList` and `removeFromDisplayList` are new methods that allows for you to now add a Layer as a child of another Layer. Fix #5799 (thanks @samme)
* `GameObjects.Video.loadURL` has a new optional 4th parameter `crossOrigin`. This allows you to specify a cross origin request type when loading the video cross-domain (thanks @rmartell)
* You can now set `loader.imageLoadType: "HTMLImageElement"` in your Game Configuration and the Phaser Loader will use an Image Tag to load all images, rather than XHR and a Blob object which is the default. This is a global setting, so all file types that use images, such as Atlas or Spritesheet, will be changed via this flag (thanks @hanzooo)
* You can now control the drawing offset of tiles in a Tileset using the new optional property `Tileset.tileOffset` (which is a Vector2). This property is set automatically when Tiled data is parsed and found to contain it. Fix #5633 (thanks @moJiXiang @kainage)
* You can now set the alpha value of the Camera Flash effect before running it, where-as previously it was always 1 (thanks @kainage)
* The `Tilemap.createFromObjects` method has been overhauled to support typed tiles from the Tiled Map Editor (https://doc.mapeditor.org/en/stable/manual/custom-properties/#typed-tiles). It will now also examine the Tileset to inherit properties based on the tile gid. It will also now attempt to use the same texture and frame as Tiled when creating the object (thanks @lackhand)
* `TweenManager.reset` is a new method that will take a tween, remove it from all internal arrays, then seek it back to its start and set it as being active.
* The `Video` config will now detect for `x-m4v` playback support for video formats and store it in the `Video.m4v` property. This is used automatically by the `VideoFile` file loader. Fix #5719 (thanks @patrickkeenan)
* The `KeyboardPlugin.removeKey` method has a new optional parameter `removeCapture`. This will remove any keyboard capture events for the given Key. Fix #5693 (thanks @cyantree)
* The `KeyboardPlugin.removeAllKeys` method has a new optional parameter `removeCapture`. This will remove any keyboard capture events for all of the Keys owned by the plugin.
* `WebGLShader.fragSrc` is a new property that holds the source of the fragment shader.
* `WebGLShader.vertSrc` is a new property that holds the source of the vertex shader.
* `WebGLShader#.createProgram` is a new method that will destroy and then re-create the shader program based on the given (or stored) vertex and fragment shader source.
* `WebGLShader.setBoolean` is a new method that allows you to set a boolean uniform on a shader.
* `WebGLPipeline.setBoolean` is a new method that allows you to set a boolean uniform on a shader.
* `Phaser.Scenes.Systems.getStatus` is a new method that will return the current status of the Scene.
* `Phaser.Scenes.ScenePlugin.getStatus` is a new method that will return the current status of the given Scene.
* `Math.LinearXY` is a new function that will interpolate between 2 given Vector2s and return a new Vector2 as a result (thanks @GregDevProjects)
* `Curves.Path.getCurveAt` is a new method that will return the curve that forms the path at the given location (thanks @natureofcode)
* You can now use any `Shape` Game Object as a Geometry Mask. Fix #5900 (thanks @rexrainbow)
* `Mesh.setTint` is a new method that will set the tint color across all vertices of a Mesh (thanks @rexrainbow)
* `Mesh.tint` is a new setter that will  set the tint color across all vertices of a Mesh (thanks @rexrainbow)
* `Mesh.clearTint` is a new method that will clear the tint from all vertices of a Mesh (thanks @rexrainbow)
* You can now use dot notation as the datakey when defining a Loader Pack File (thanks @rexrainbow)
* `Vector2.project` is a new method that will project the vector onto the given vector (thanks @samme)
* Experimental feature: The `TilemapLayer` now has the `Mask` component - meaning you can apply a mask to tilemaps (thanks @samme)
* `TilemapLayer.setTint` is a new method that allows you to set the tint color of all tiles in the given area, optionally based on the filtering search options. This is a WebGL only feature.
* `UtilityPipeline.blitFrame` has a new optional boolean parameter `flipY` which, if set, will invert the source Render Target while drawing it to the destination Render Target.
* `GameObjects.Polygon.setTo` is a new method that allows you to change the points being used to render a Polygon Shape Game Object. Fix #6151 (thanks @PhaserEditor2D)
* `maxAliveParticles` is a new Particle Emitter config property that sets the maximum number of _alive_ particles the emitter is allowed to update. When this limit is reached a particle will have to die before another can be spawned.
* `Utils.Array.Flatten` is a new function that will return a flattened version of an array, regardless of how deeply-nested it is.
* `GameObjects.Text.appendText` is a new method that will append the given text, or array of text, to the end of the content already stored in the Text object.
* `Textures.Events.ADD_KEY` is a new event dispatched by the Texture Manager when a texture with the given key is added, allowing you to listen for the addition of a specific texture (thanks @samme)
* `Textures.Events.REMOVE_KEY` is a new event dispatched by the Texture Manager when a texture with the given key is removed, allowing you to listen for the removal of a specific texture (thanks @samme)

### Geom Updates

The following are API-breaking, in that a new optional parameter has been inserted prior to the output parameter. If you use any of the following functions, please update your code:

* The `Geom.Intersects.GetLineToLine` method has a new optional parameter `isRay`. If `true` it will treat the first line parameter as a ray, if false, as a line segment (the default).
* The `Geom.Intersects.GetLineToPoints` method has a new optional parameter `isRay`. If `true` it will treat the line parameter as a ray, if false, as a line segment (the default).
* The `Geom.Intersects.GetLineToPolygon` method has a new optional parameter `isRay`. If `true` it will treat the line parameter as a ray, if false, as a line segment (the default).
* `Geom.Intersects.GetRaysFromPointToPolygon` uses the new `isRay` parameter to enable this function to work fully again.

### Loader Updates

* `MultiFile.pendingDestroy` is a new method that is called by the Loader Plugin and manages preparing the file for deletion. It also emits the `FILE_COMPLETE` and `FILE_KEY_COMPLETE` events, fixing a bug where `MultiFile` related files, such as an Atlas JSON or a Bitmap Font File, wouldn't emit the `filecomplete` events for the parent file, only for the sub-files. This means you can now listen for the file completion event for `multiatlas` files, among others.
* `MultiFile.destroy` is a new method that clears down all external references of the file, helping free-up resources.
* `File.addToCache` no longer calls `File.pendingDestroy`, instead this is now handled by the Loader Plugin.
* There is a new File constant `FILE_PENDING_DESTROY` which is used to ensure Files aren't flagged for destruction more than once.
* `LoaderPlugin.localSchemes` is a new array of scheme strings that the Loader considers as being local files. This is populated by the new `Phaser.Core.Config#loaderLocalScheme` game / scene config property. It defaults to `[ 'file://', 'capacitor://' ]` but additional schemes can be defined or pushed onto this array. Based on #6010 (thanks @kglogocki)

### Updates

* The `Device.Browser` checks for Opera and Edge have been updated to use the more modern user agent strings those browsers now use. This breaks compatibility with really old versions of those browsers but fixes it for modern ones (which is more important) (thanks @
ArtemSiz)
* The `SceneManager.processQueue` method will no longer `return` if a new Scene was added, after starting it. This allows any other queued operations to still be run in the same frame, rather than being delayed until the next game frame. Fix #5359 (thanks @telinc1)
* `Camera.scrollX` and `scrollY` will now only set the `Camera.dirty` flag to `true` if the new value given to them is different from their current value. This allows you to use this property in your own culling functions. Fix #6088 (thanks @Waclaw-I)
* `Face.update` is a new method that updates each of the Face vertices. This is now called internally by `Face.isInView`.
* `Vertex.resize` is a new method that will set the position and then translate the Vertex based on an identity matrix.
* The `Vertex.update` method now returns `this` to allow it to be chained.
* You can now optionally specify the `maxSpeed` value in the Arcade Physics Group config (thanks @samme)
* You can now optionally specify the `useDamping` boolean in the Arcade Physics Group config (thanks @samme)
* Removed the `HexagonalTileToWorldY` function as it cannot work without an X coordinate. Use `HexagonalTileToWorldXY` instead.
* Removed the `HexagonalWorldToTileY` function as it cannot work without an X coordinate. Use `HexagonalWorldToTileXY` instead.
* Earcut has been updated to version 2.2.4. This release improves performance by 10-15% and fixes 2 rare race conditions that could leave to infinite loops. Earcut is used internally by Graphics and Shape game objects when triangulating polygons for complex shapes.
* The `BaseSoundManager.getAll` method used to require a `key` parameter, to return Sounds matching the key. This is now optional and if not given, all Sound instances are returned.
* The `WebAudioSoundManager` will now detect if the Audio Context enters a 'suspended' or 'interrupted' state as part of its update loop and if so it'll try to resume the context. This can happen if you change or disable the audio device, such as plugging in headphones with built-in audio drivers then disconnecting them, or swapping tabs on iOS. Fix #5353 (thanks @helloyoucan)
* The `CONTEXT_RESTORED` Game Event has been removed and the WebGL Renderer no longer listens for the `contextrestored` DOM event, or has a `contextRestoredHandler` method. This never actually worked properly, in any version of Phaser 3 - although the WebGLRenderer would be restored, none of the shaders, pipelines or textures were correctly re-created. If a context is now lost, Phaser will display an error in the console and all rendering will halt. It will no longer try to re-create the context, leading to masses of WebGL errors in the console. Instead, it will die gracefully and require a page reload.
* The `Text` and `TileSprite` Game Objects no longer listen for the `CONTEXT_RESTORED` event and have had their `onContextRestored` methods removed.
* `Scenes.Systems.canInput` is a new internal method that determines if a Scene can receive Input events, or not. This is now used by the `InputPlugin` instead of the previous `isActive` test. This allows a Scene to emit and handle input events even when it is running `init` or `preload`. Previously, it could only do this after `create` had finished running. Fix #6123 (thanks @yaasinhamidi)
* The `BitmapText` Game Object has two new read-only properties `displayWidth` and `displayHeight`. This allows the BitmapText to correctly use the `GetBounds` component.
* The `BitmapText` Game Object now has the `GetBounds` component added to it, meaning you can now correctly get its dimensions as part of a Container. Fix #6237 (thanks @likwidgames)
* `WebGLSnapshot` will now flip the pixels in the created Image element if the source was a framebuffer. This means grabbing a snapshot from a Dynamic or Render Texture will now correctly invert the pixels on the y axis for an Image. Grabbing from the game renderer will skip this.
* `WebGLRenderer.snapshotFramebuffer` and by extension, the snapshot methods in Dynamic Textures and Render Textures, has been updated to ensure that the width and height never exceed the framebuffer dimensions, or it'll cause a runtime error. The method `snapshotArea` has had this limitation removed as a result, allowing you to snapshot areas that are larger than the Canvas. Fix #5707 (thanks @teng-z)
* `Animation.stop` is always called when a new animation is loaded, regardless if the animation was playing or not and the `delayCounter` is reset to zero. This stops animations with delays preventing other animations from being started until the delay has expired. Fix #5680 (thanks @enderandpeter)
* `ScaleManager.listeners` has been renamed to `domlisteners` to avoid conflicting with the EventEmitter listeners object. Fix #6260 (thanks @x-wk)
* `Geom.Intersects.LineToLine` will no longer create an internal `Point` object, as it's not required internally (thanks @Trissolo)
* The `tempZone` used by `GridAlign` has now had `setOrigin(0, 0)` applied to it. This leads to more accurate / expected zone placement when aligning grid items.
* The `GetBitmapTextSize` function now includes an extra property in the resulting `BitmapTextCharacter` object called `idx` which is the index of the character within the Bitmap Text, without factoring in any word wrapping (thanks @JaroVDH)
* `Camera.isSceneCamera` is a new boolean that controls if the Camera belongs to a Scene (the default), or a Texture. You can set this via the `Camera.setScene` method. Once set the `Camera.updateSystem` method is skipped, preventing the WebGL Renderer from setting a scissor every frame.
* `Camera.preRender` will now apply `Math.floor` instead of `Math.round` to the values, keeping it consistent with the Renderer when following a sprite.
* When rendering a Sprite with a Camera set to `roundPixels` it will now run `Math.floor` on the Matrix position, preventing you from noticing 'jitters' as much when Camera following sprites in heavily zoomed Camera systems.
* `TransformMatrix.setQuad` is a new method that will perform the 8 calculations required to create the vertice positions from the matrix and the given values. The result is stored in the new `TransformMatrix.quad` Float32Array, which is also returned from this method.
* `TransformMatrix.multiply` now directly updates the Float32Array, leading to 6 less getter invocations.
* The `CameraManager.getVisibleChildren` method now uses the native Array filter function, rather than a for loop. This should improve performance in some cases (thanks @JernejHabjan)
* `SceneManager.systemScene` is a new property that is set during the game boot and is a system Scene reference that plugins and managers can use, that lives outside of the Scene list.
* The `TextureManager.get` methof can now accept a `Frame` instance as its parameter, which will return the frames parent Texture.
* The `GameObject.setFrame` method can now accept a `Frame` instance as its parameter, which will also automatically update the Texture the Game Object is using.
* `Device.safariVersion` is now set to the version of Safari running, previously it was always undefined.
* When you try to use a frame that is missing on the Texture, it will now give the key of the Texture in the console warning (thanks @samme)
* The `hitArea` parameter of the `GameObjects.Zone.setDropZone` method is now optional and if not given it will try to create a hit area based on the size of the Zone Game Object (thanks @rexrainbow)
* The `DOMElement.preUpdate` method has been removed. If you overrode this method, please now see `preRender` instead.
* `DOMElement.preRender` is a new method that will check parent visibility and improve its behavior, responding to the parent even if the Scene is paused or the element is inactive. Dom Elements are also no longer added to the Scene Update List. Fix #5816 (thanks @prakol16 @samme)
* Phaser 3 is now built with webpack 5 and all related packages have been updated.
* Previously, an Array Matrix would enforce it had more than 2 rows. This restriction has been removed, allowing you to define and rotate single-row array matrices (thanks @andriibarvynko)
* The Gamepad objects now have full TypeScript definitions thanks to @sylvainpolletvillard
* Lots of configuration objects now have full TypeScript definitions thanks to @16patsle
* `Particle.fire` will now throw an error if the particle has no texture frame. This prevents an uncaught error later when the particle fails to render. Fix #5838 (thanks @samme @monteiz)
* `ParticleEmitterManager.setEmitterFrames` will now print out console warnings if an invalid texture frame is given, or if no texture frames were set. Fix #5838 (thanks @samme @monteiz)
* `SceneManager.stop` and `sleep` will now ignore the call if the Scene has already been shut down, avoiding potential problems with duplicate event handles. Fix #5826 (thanks @samme)
* Removed the `Tint` and `Flip` components from the `Camera` class. Neither were ever used internally, or during rendering, so it was just confusing having them in the API.
* A new `console.error` will be printed if the `File`, `MultiFile`, `JSONFile` or `XMLFile` fail to process or parse correctly, even if they manage to load. Fix #5862 #5851 (thanks @samme @ubershmekel)
* The `ScriptFile` Loader File Type has a new optional parameter: `type`. This is a string that controls the type attribute of the `<script>` tag that is generated by the Loader. By default it is 'script', but you can change it to 'module' or any other valid type.
* The JSON Hash and Array Texture Parsers will now throw a console.warn if the JSON is invalid and contains identically named frames.
* `Scene.pause` will now check to see if the Scene is in either a RUNNING or CREATING state and throw a warning if not. You cannot pause non-running Scenes.
* `Mesh.addVertices` will now throw a console warning if invalid vertices data is given to the method (thanks @omniowl)
* `Mesh.addVerticesFromObj` will now throw a console warning if invalid vertices data is given to the method (thanks @omniowl)
* `TouchManager.onTouchOver` and `onTouchOut` have been removed, along with all of their related event calls as they're not used by any browser any more.
* `TouchManager.isTop` is a new property, copied from the MouseManager, that retains if the window the touch is interacting with is the top one, or not.
* The `InputManager.onTouchMove` method will now check if the changed touch is over the canvas, or not, via the DOM `elementFromPoint` function. This means if the touch leaves the canvas, it will now trigger the `GAME_OUT` and `GAME_OVER` events, where-as before this would only happen for a Mouse. If the touch isn't over the canvas, no Pointer touch move happens, just like with the mouse. Fix #5592 (thanks @rexrainbow)
* `TileMap.createBlankDynamicLayer` has now been removed as it was deprecated in 3.50.
* `TileMap.createDynamicLayer` has now been removed as it was deprecated in 3.50.
* `TileMap.createStaticLayer` has now been removed as it was deprecated in 3.50.
* `Animations.AnimationManager.createFromAseprite` has a new optional 3rd parameter `target`. This allows you to create the animations directly on a Sprite, instead of in the global Animation Manager (thanks Telemako)
* `Animations.AnimationState.createFromAseprite` is a new method that allows you to create animations from exported Aseprite data directly on a Sprite, rather than always in the global Animation Manager (thanks Telemako)
* The `path` package used by the TS Defs generator has been moved to `devDependencies` (thanks @antkhnvsk)
* The `GetValue` function has a new optional parameter `altSource` which allows you to provide an alternative object to source the value from.
* The `Renderer.Snapshot.WebGL` function has had its first parameter changed from an `HTMLCanvasElement` to a `WebGLRenderingContext`. This is now passed in from the `snapshot` methods inside the WebGL Renderer. The change was made to allow it to work with WebGL2 custom contexts (thanks @andymikulski)
* If you start a Scene that is already starting (START, LOADING, or CREATING) then the start operation is now ignored (thanks @samme)
* If you start a Scene that is Sleeping, it is shut down before starting again. This matches how Phaser currently handles paused scenes (thanks @samme)
* The right-click context menu used to be disabled on the document.body via the `disableContextMenu` function, but instead now uses the MouseManager / TouchManager targets, which if not specified defaults to the game canvas. Fix # (thanks @lukashass)
* The Particle 'moveTo' calculations have been simplied and made more efficient (thanks @samme)
* The `Key.reset` method no longer resets the `Key.enabled` or `Key.preventDefault` booleans back to `true` again, but only resets the state of the Key. Fix #6098 (thanks @descodifica)
* When setting the Input Debug Hit Area color it was previously fixed to the value given when created. The value is now taken from the object directly, meaning you can set `gameObject.hitAreaDebug.strokeColor` in real-time (thanks @spayton)
* You can now have a particle frequency smaller than the delta step, which would previously lead to inconsistencies in emission rates (thanks @samme)
* The `Light` Game Object now has the `Origin` and `Transform` components, along with 4 new properties: `width`, `height`, `displayWidth` and `displayHeight`. This allows you to add a Light to a Container, or enable it for physics. Fix #6126 (thanks @jcoppage)
* The `Transform` Component has a new boolean read-only property `hasTransformComponent` which is set to `true` by default.
* The Arcade Physics `World.enableBody` method will now only create and add a `Body` to an object if it has the Transform component, tested by checking the `hasTransformComponent` property. Without the Transform component, creating a Body would error with NaN values, causing the rest of the bodies in the world to fail.
* `ProcessQueue.isActive` is a new method that tests if the given object is in the active list, or not.
* `ProcessQueue.isPending` is a new method that tests if the given object is in the pending insertion list, or not.
* `ProcessQueue.isDestroying` is a new method that tests if the given object is pending destruction, or not.
* `ProcessQueue.add` will no longer place the item into the pending list if it's already active or pending.
* `ProcessQueue.remove` will check if the item is in the pending list, and simply remove it, rather than destroying it.
* `Container.addHandler` will now call `GameObject.addedToScene`.
* `Container.removeHandler` will now call `GameObject.removedFromScene`.
* If defined, the width and height of an input hit area will now be changed if the Frame of a Game Object changes. Fix #6144 (thanks @rexrainbow)
* When passing a `TextStyle` configuration object to the Text Game Objects `setStyle` method, it would ignore any `metrics` data it may contain and reset it back to the defaults. It will now respect the `metrics` config and use it, if present. Fix #6149 (thanks @michalfialadev)
* A Texture `ScaleMode` will now override the Game Config `antialias` setting under the Canvas Renderer, where-as before if `antialias` was `true` then it would ignore the scale mode of the texture (thanks @Cirras)
* The `Device.Audio` module has been rewritten to use a new internal `CanPlay` function that cuts down on the amount of code required greatly.
* `Device.Audio.aac` is a new boolean property that defines if the browser can play aac audio files or not, allowing them to be loaded via the Loader (thanks @Ariorh1337)
* `Device.Audio.flac` is a new boolean property that defines if the browser can play flac audio files or not, allowing them to be loaded via the Loader (thanks @Ariorh1337)
* The `Physics.Arcade.Body.reset()` method will now call `Body.checkWorldBounds` as part of the process, moving the body outside of the bounds, should you have positioned it so they overlap during the reset. Fix #5978 (thanks @lukasharing)
* The temporary canvas created in `CanvasFeatures` for the `checkInverseAlpha` test is now removed from the CanvasPool after use.
* The `CanvasFeatures` tests and the TextureManager `_tempContext` now specify the `{ willReadFrequently: true }` hint to inform the browser the canvas is to be read from, not composited.
* When calling `TextureManager.getTextureKeys` it will now exclude the default `__WHITE` texture from the results (thanks @samme)
* If the WebGL Renderer logs an error, it will now show the error string, or the code if not present in the error map (thanks @zpxp)
* The `NoAudioSoundManager` now has all of the missing methods, such as `removeAll` and `get` to allow it to be a direct replacement for the HTML5 and WebAudio Sound Managers (thanks @orjandh @samme)
* The `Texture.destroy` method will only destroy sources, dataSources and frames if they exist, protecting against previously destroyed instances.

### Bug Fixes

* The `maxSpeed` setting in Arcade Physics wasn't recalculated during the Body update, prior to being compared, leading to inconsistent results. Fix #6329 (thanks @Bambosh)
* Several paths have been fixed in the `phaser-core.js` entry point (thanks @pavle-goloskokovic)
* When a Game Object had Input Debug Enabled the debug image would be incorrectly offset if the Game Object was attached to was scaled and the hit area shape was smaller, or offset, from the Game Object. Fix #4905 #6317 (thanks @PavelMishin @justinlueders)
* An inactive Scene is no longer updated after a Scene transition completes. Previously, it will still update the Scene one final time. This fix also prevents the `POST_UPDATE` event from firing after the transition is over. Fix #5550 (thanks @mijinc0 @samme)
* Although not recommended, when adding a `Layer` Game Object to another `Layer` Game Object, it will no longer error because it cannot find the `removeFromDisplayList` function. Fix #5595 (thanks @tringcooler)
* The `Actions.Spread` method will now place the final item correctly and abort early if the array only contains 1 or 0 items (thanks @EmilSV)
* Calling `setDisplayOrigin` on a `Video` Game Object would cause the origins to be set to `NaN` if the Video was created without an asset key. It will now give Videos a default size, preventing this error, which is reset once a video is loaded. Fix #5560 (thanks @mattjennings)
* When `ImageFile` loads with a linked Normal Map and the map completes first, but the Image is still in a pending state, it would incorrectly add itself to the cache instead of waiting. It now checks this process more carefully. Fix #5886 (thanks @inmylo)
* Using a `dataKey` to specify a part of a JSON file when using `load.pack` would fail as it wouldn't correctly assign the right part of the pack file to the Loader. You can now use this parameter properly. Fix #6001 (thanks @rexrainbow)
* The `Text.advancedWordWrap` function would incorrectly merge the current and next lines when wrapping words with carriage-returns in. Fix #6187 (thanks @Ariorh1337 @robinheidrich)
* Recoded the point conversion math in the `HexagonalTileToWorldXY` function as it was incorrect. Now returns world coordinates correctly.
* `Tilemap.copy` would error if you copied a block of tiles over itself, even partially, as it tried to copy already replaced tiles as part of the function. It will now copy correctly, regardless of source or destination areas. Fix #6188 (thanks @Arkyris)
* `Tile.copy` will now use the `DeepCopy` function to copy the `Tile.properties` object, as otherwise it just gets copied by reference.
* Recoded the point conversion math in the `HexagonalWorldToTileXY` function as it was incorrect. Now detects any dimension hexagon correctly. Fix #5608 (thanks @stonerich)
* Fixed the point conversion math in the `IsometricWorldToTileXY` function and added optional boolean property that allows the setting of the tile origin to the top or base. Fix #5781 (thanks @benjamin-wilson)
* Calling `Tilemap.worldToTileX` or `worldToTileY` on a Isometric or Hexagonal Tilemap will now always return `null` instead of doing nothing, as you cannot convert to a tile index using just one coordinate for these map types, you should use `worldToTileXY` instead.
* The `Game.headlessStep` method will now reset `SceneManager.isProcessing` before `PRE_RENDER`. This fixes issues in HEADLESS mode where the Scene Manager wouldn't process additionally added Scenes created after the Game had started. Fix #5872 #5974 (thanks @micsun-al @samme)
* If `Rope.setPoints` was called with the exact same number of points as before, it wouldn't set the `dirty` flag, meaning the vertices were not updated on the next render (thanks @stupot)
* `Particle.fire` will now check to see if the parent Emitter is set to follow a Game Object and if so, and if the x/y EmitterOps are spread ops, then it'll space the particles out based on the follower coordinates, instead of clumping them all together. Fix #5847 (thanks @sreadixl)
* When using RTL (right-to-left) `Text` Game Objects, the Text would vanish on iOS15+ if you changed the text or font style. The context RTL properties are now restored when the text is updated, fixing this issue. Fix #6121 (thanks @liorGameDev)
* The `Tilemap.destroyLayer` method would throw an error "TypeError: layer.destroy is not a function". It now correctly destroys the TilemapLayer. Fix #6268 (thanks @samme)
* `MapData` and `ObjectLayer` will now enforce that the `Tilemap.objects` property is always an array. Sometimes Tiled willl set it to be a blank object in the JSON data. This fix makes sure it is always an array. Fix #6139 (thanks @robbeman)
* The `ParseJSONTiled` function will now run a `DeepCopy` on the source Tiled JSON, which prevents object mutation, fixing an issue where Tiled Object Layer names would be duplicated if used across multiple Tilemap instances. Fix #6212 (thanks @temajm @wahur666)
* The method `Color.setFromHSV` would not change the members `h`, `s` and `v`, only the RGB properties. It now correctly updates them both. Fix #6276 (thanks @rexrainbow)
* When calling `GameObject.getPostPipeline` and passing in a string for the pipeline name it would error with 'Uncaught TypeError: Right-hand side of 'instanceof' is not an object'. This is now handled correctly internally (thanks @neki-dev)
* When playing a chained animation, the `nextAnim` property could get set to `undefined` which would stop the next animation in the queue from being set. The check now handles all falsey cases. Fix #5852 (thanks @Pythux)
* When calling `InputPlugin.clear` it will now call `removeDebug` on the Game Object, making sure it clears up any Input Debug Graphics left in the Scene. Fix #6137 (thanks @spayton)
* The `Video.loadURL` method wouldn't load the video or emit the `VIDEO_CREATED` event unless `noAudio` was specified. A load event handler has been added to resolve this (thanks @samme)
* If you create a repeating or looping `TimerEvent` with a `delay` of zero it will now throw a runtime error as it would lead to an infinite loop. Fix #6225 (thanks @JernejHabjan)
* The `endFrame` and `startFrame` properties of the `SpriteSheet` parser wouldn't correctly apply themselves, the Texture would still end up with all of the frames. It will now start at the given `startFrame` so that is frame zero and end at `endFrame`, regardless how many other frames are in the sheet.
* Destroying a `WebAudioSound` in the same game step as destroying the Game itself would cause an error when trying to disconnect already disconnected Web Audio nodes. `WebAudioSound` will now bail out of its destroy sequence if it's already pending removal.
* `Animation.createFromAseprite` would calculate an incorrect frame duration if the frames didn't all have the same speed.
* The URL scheme `capacitor://` has been added to the protocol check to prevent malformed double-urls in some environments (thanks @consolenaut)
* Removed `Config.domBehindCanvas` property as it's never used internally. Fix #5749 (thanks @iamallenchang)
* `dispatchTweenEvent` would overwrite one of the callback's parameters. This fix ensures that `Tween.setCallback` now works consistently. Fix #5753 (thanks @andrei-pmbcn @samme)
* The context restore event handler is now turned off when a Game Object is destroyed. This helps avoid memory leakage from Text and TileSprite Game Objects, especially if you consistently destroy and recreate your Game instance in a single-page app (thanks @rollinsafary-inomma @rexrainbow @samme)
* When the device does not support WebGL, creating a game with the renderer type set to `Phaser.WEBGL` will now fail with an error. Previously, it would fall back to Canvas. Now it will not fall back to Canvas. If you require that feature, use the AUTO render type. Fix #5583 (thanks @samme)
* The `Tilemap.createFromObjects` method will now correctly place both tiles and other objects. Previously, it made the assumption that the origin was 0x1 for all objects, but Tiled only uses this for tiles and uses 0x0 for its other objects. It now handles both. Fix #5789 (thanks @samme)
* The `CanvasRenderer.snapshotCanvas` method used an incorrect reference to the canvas, causing the operation to fail. It will now snapshot a canvas correctly. Fix #5792 #5448 (thanks @rollinsafary-inomma @samme @akeboshi1)
* The `Tilemap.tileToWorldY` method incorrectly had the parameter `tileX`. It will worked, but didn't make sense. It is now `tileY` (thanks @mayacoda)
* The `Tilemap.convertTilemapLayer` method would fail for _isometric tilemaps_ by not setting the physic body alignment properly. It will now call `getBounds` correctly, allowing for use on non-orthagonal maps. Fix #5764 (thanks @mayacoda)
* The `PluginManager.installScenePlugin` method will now check if the plugin is missing from the local keys array and add it back in, if it is (thanks @xiamidaxia)
* The Spine Plugin would not work with multiple instances of the same game on a single page. It now stores its renderer reference outside of the plugin, enabling this. Fix #5765 (thanks @xiamidaxia)
* In Arcade Physics, Group vs. self collisions would cause double collision callbacks due to the use of the quad tree. For this specific conditions, the quad tree is now skipped. Fix #5758 (thanks @samme)
* During a call to `GameObject.Shapes.Rectangle.setSize` it will now correctly update the Rectangle object's display origin and default hitArea (thanks @rexrainbow)
* The Arcade Physics Body will now recalculate its center after separation with a Tile in time for the values to be correct in the collision callbacks (thanks @samme)
* The `ParseTileLayers` function has been updated so that it no longer breaks when using a Tiled infinite map with empty chunks (thanks @jonnytest1)
* The `PutTileAt` function will now set the Tile dimensions from the source Tileset, fixing size related issues when placing tiles manually. Fix #5644 (thanks @moJiXiang @stuffisthings)
* The new `Tileset.tileOffset` property fixes an issue with drawing isometric tiles when an offset had been defined in the map data (thanks @moJiXiang)
* Fixed issue in `Geom.Intersects.GetLineToLine` function that would fail with colinear lines (thanks @Skel0t)
* The `CameraManager.destroy` function will now remove the Scale Manager `RESIZE` event listener created as part of `boot`, where-as before it didn't clean it up, leading to gc issues. Fix #5791 (thanks @liuhongxuan23)
* With `roundPixels` set to true in the game or camera config, Sprites will no longer render at sub-pixel positions under CANVAS. Fix #5774 (thanks @samme)
* The Camera will now emit `PRE_RENDER` and `POST_RENDER` events under the Canvas Renderer. Fix #5729 (thanks @ddanushkin)
* The Multi Pipeline now uses `highp float` precision by default, instead of `mediump`. This fixes issues with strange blue 'spots' appearing under WebGL on some Android devices. Fix #5751 #5659 #5655 (thanks @actionmoon @DuncanPriebe @ddanushkin)
* The `Tilemaps.Tile.getBounds` method would take a `camera` parameter but then not pass it to the methods called internally, thus ignoring it. It now factors the camera into the returned Rectangle.
* `Tilemap.createFromObjects` has had the rendering of Tiled object layers on isometric maps fixed. Objects contained in object layers generated by Tiled use orthogonal positioning even when the map is isometric and this update accounts for that (thanks @lfarroco)
* Timers with very short delays (i.e. 1ms) would only run the callback at the speed of the frame update. It will now try and match the timer rate by iterating the calls per frame. Fix #5863 (thanks @rexrainbow)
* The `Text`, `TileSprite` and `RenderTexture` Game Objects would call the pre and post batch functions twice by mistake, potentially applying a post fx twice to them.
* `ScaleManager.getParentBounds` will now also check to see if the canvas bounds have changed x or y position, and if so return `true`, causing the Scale Manager to refresh all of its internal cached values. This fixes an issue where the canvas may have changed position on the page, but not its width or height, so a refresh wasn't triggered. Fix #5884 (thanks @jameswilddev)
* The `SceneManager.bootScene` method will now always call `LoaderPlugin.start`, even if there are no files in the queue. This means that the Loader will always dispatch its `START` and `COMPLETE` events, even if the queue is empty because the files are already cached. You can now rely on the `START` and `COMPLETE` events to be fired, regardless, using them safely in your preload scene. Fix #5877 (thanks @sipals)
* Calling `TimerEvent.reset` in the Timer callback would cause the timer to be added to the Clock's pending removal and insertion lists together, throwing an error. It will now not add to pending removal if the timer was reset. Fix #5887 (thanks @rexrainbow)
* Calling `ParticleEmitter.setScale` would set the `scaleY` property to `null`, causing calls to `setScaleY` to throw a runtime error. `scaleY` is now a required property across both the Particle and Emitter classes and all of the conditional checks for it have been removed (thanks ojg15)
* Calling `Tween.reset` when a tween was in a state of `PENDING_REMOVE` would cause it to fail to restart. It now restarts fully. Fix #4793 (thanks @spayton)
* The default `Tween._pausedState` has changed from `INIT` to `PENDING_ADD`. This fixes a bug where if you called `Tween.play` immediately after creating it, it would force the tween to freeze. Fix #5454 (thanks @michal-bures)
* If you start a `PathFollower` with a `to` value it will now tween and complete at that value, rather than the end of the path as before (thanks @samme)
* `Text` with RTL enabled wouldn't factor in the left / right padding correctly, causing the text to be cut off. It will now account for padding in the line width calculations. Fix #5830 (thanks @rexrainbow)
* The `Path.fromJSON` function would use the wrong name for a Quadratic Bezier curve class, meaning it would be skipped in the exported JSON. It's now included correctly (thanks @natureofcode)
* The `Input.Touch.TouchManager.stopListeners` forgot to remove the `touchcancel` handler. This is now removed correctly (thanks @teng-z)
* The `BitmapMask` shader has been recoded so it now works correctly if you mask a Game Object that has alpha set on it, or in its texture. Previously it would alpha the Game Object against black (thanks stever1388)
* When the Pointer moves out of the canvas and is released it would trigger `Uncaught TypeError: Cannot read properties of undefined (reading 'renderList')` if multiple children existed in the pointer-out array. Fix #5867 #5699 (thanks @rexrainbow @lyger)
* If the Input Target in the game config was a string, it wouldn't be correctly parsed by the Touch Manager.
* The `GameObject.willRender` method will now factor in the parent `displayList`, if it has one, to the end result. This fixes issues like that where an invisible Layer will still process input events. Fix #5883 (thanks @rexrainbow)
* `InputPlugin.disable` will now also reset the drag state of the Game Object as well as remove it from all of the internal temporary arrays. This fixes issues where if you disabled a Game Object for input during an input event it would still remain in the temporary internal arrays. This method now also returns the Input Plugin, to match `enable`. Fix #5828 (thank @natureofcode @thewaver)
* The `GetBounds` component has been removed from the Point Light Game Object. Fix #5934 (thanks @x-wk @samme)
* `SceneManager.moveAbove` and `moveBelow` now take into account the modified indexes after the move (thanks @EmilSV)
* When forcing a game to use `setTimeout` and then sending the game to sleep, it would accidentally restart by using Request Animation Frame instead (thanks @andymikulski)
* Including a `render` object within the Game Config will no longer erase any top-level config render settings. The `render` object will now take priority over the game config, but both will be used (thanks @vzhou842)
* Calling `Tween.stop(0)` would run for an additional delta before stopping, causing the Tween to not be truly 100% "reset". Fix #5986 (thanks @Mesonyx)
* The `Utils.Array.SafeRange` function would exclude valid certain ranges. Fix #5979 (thanks @ksritharan)
* The "Skip intersects check by argument" change in Arcade Physics has been reverted. Fix #5956 (thanks @samme)
* The `Container.pointToContainer` method would ignore the provided `output` parameter, but now uses it (thanks @vforsh)
* The `Polygon` Game Object would ignore its `closePath` property when rendering in Canvas. Fix #5983 (thanks @optimumsuave)
* IE9 Fix: Added 2 missing Typed Array polyfills (thanks @jcyuan)
* IE9 Fix: CanvasRenderer ignores frames with zero dimensions (thanks @jcyuan)
* `BlitterCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `ParticleManagerCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `CanvasSnapshot` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `TextureManager.getBase64` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* `TilemapLayerCanvasRenderer` will now skip the `drawImage` call in canvas if the frame width or height are zero.
* Audio will now unlock properly again on iOS14 and above in Safari. Fix #5696 (thanks @laineus)
* Drawing Game Objects to a Render Texture in WebGL would skip their blend modes. This is now applied correctly. Fix #5565 #5996 (thanks @sjb933 @danarcher)
* Loading a Script File Type will now default the 'type' property to 'script' when a type is not provided. Fix #5994 (thanks @samme @ItsGravix)
* If you Paused or Stopped a Scene that was in a preload state, it would still call 'create' after the Scene had shutdown (thanks @samme)
* BitmapText rendering wouldn't correctly apply per-character kerning offsets. These are now implemented during rendering (thanks @arbassic)
* Child Spine objects inside Containers wouldn't correctly inherit the parent Containers alpha. Fix #5853 (thanks @spayton)
* The DisplayList will now enter a while loop until all Game Objects are destroyed, rather than cache the list length. This prevents "cannot read property 'destroy' of undefined" errors in Scenes. Fix #5520 (thanks @schontz @astei)
* Particles can now be moved to 0x0. `moveToX` and `moveToY` now default to null instead of 0 (thanks @samme)
* Layers will now destroy more carefully when children destroy themselves (thanks @rexrainbow)
* An error in the `GetBitmapTextSize` function caused kerning to not be applied correctly to Bitmap Text objects. This now works across WebGL and Canvas (thanks @arbassic @TJ09)
* `WebGLSnapshot` and `CanvasSnapshot` will now Math.floor the width/height values to ensure no sub-pixel dimensions, which corrupts the resulting texture. Fix #6099 (thanks @orjandh)
* `ContainerCanvasRenderer` would pass in a 5th `container` parameter to the child `renderCanvas` call, which was breaking the `GraphicsCanvasRenderer` and isn't needed by any Game Object, so has been removed. Fix #6093 (thanks @Antriel)
* Fixed issue in `Utils.Objects.GetValue` where it would return an incorrect result if a `source` and `altSource` were provided that didn't match in structure. Fix #5952 (thanks @rexrainbow)
* Fixed issue in Game Config where having an empty object, such as `render: {}` would cause set properties to be overriden with the default value. Fix #6097 (thanks @michalfialadev)
* The `SceneManager.moveAbove` and `moveBelow` methods didn't check the order of the Scenes being moved, so moved them even if one was already above / below the other. Both methods now check the indexes first. Fix #6040 (thanks @yuupsup)
* Setting `scale.mode` in the Game Config would be ignored. It now accepts either this, or `scaleMode` directly. Fix #5970 (thanks @samme)
* The frame duration calculations in the `AnimationManager.createFromAseprite` method would be incorrect if they contained a mixture of long and very short duration frames (thanks @martincapello)
* The `TilemapLayer.getTilesWithinShape` method would not return valid results when used with a Line geometry object. Fix #5640 (thanks @hrecker @samme)
* Modified the way Phaser uses `require` statements in order to fix an issue in Google's closure-compiler when variables are re-assigned to new values (thanks @TJ09)
* When creating a `MatterTileBody` from an isometric tile the tiles top value would be incorrect. The `getTop` method has been fixed to address this (thanks @adamazmil)
* Sprites created directly (not via the Game Object Factory) which are then added to a Container would fail to play their animations, because they were not added to the Scene Update List. Fix #5817 #5818 #6052 (thanks @prakol16 @adomas-sk)
* Game Objects that were created and destroyed (or moved to Containers) in the same frame were not correctly removed from the UpdateList. Fix #5803 (thanks @samme)
* `Container.removeHandler` now specifies the context for `Events.DESTROY`, fixing an issue where objects moved from one container, to another, then destroyed, would cause `sys` reference errors. Fix 5846 (thanks @sreadixl)
* `Container.removeAll` (which is also called when a Container is destroyed) will now directly destroy the children, if the given parameter is set, rather than doing it after removing them via the event handler. This fixes an issue where nested Containers would add destroyed children back to the Scene as part of their shutdown process. Fix #6078 (thanks @BenoitFreslon)
* The `DisplayList.addChildCallback` method will now check to see if the child has a parent container, and if it does, remove it from there before adding it to the Scene Display List. Fix #6091 (thanks @michalfialadev)
* `Display.RGB.equals` will now return the correct result. Previously, it would always return `false` (thanks @samme)
* When destroying the Arcade Physics World it will now destroy the debug Graphics object, had one been created. Previously, these would continue to stack-up should you restart the physics world (thanks @samme)
* `Graphics.strokeRoundedRect` would incorrectly draw the rectangle if you passed in a radius greater than half of the smaller side. This is now clamped internally (thanks @temajm)

### Examples, Documentation, Beta Testing and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Beta Testing, Docs, and TypeScript definitions, either by reporting errors, fixing them, or helping author the docs:

@0day-oni
@201flaviosilva
@AlbertMontagutCasero
@Arcanorum
@arosemena
@austinlyon
@chrisl8
@christian-post
@danfoster
@darrylpizarro
@DeweyHur
@ef4
@eltociear
@EsteFilipe
@etherealmachine
@Fake
@florestankorp
@hacheraw
@hanzooo
@jerricko
@joegaffey
@jonasrundberg
@kootoopas
@lolimay
@MaffDev
@michalfialadev
@monteiz
@necrokot
@Nero0
@orjandh
@PhaserEditor2D
@Pythux
@quocsinh
@rgk
@rollinsafary-inomma
@rstanuwijaya
@samme
@Smirnov48
@steveja42
@sylvainpolletvillard
@twoco
@ubershmekel
@VanaMartin
@vforsh
@Vidminas
@x-wk
@xmahle
@xuxucode
@YeloPartyHat
FromChris
Golen
OmniOwl
