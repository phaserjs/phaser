# Phaser 3 Change Log

## Version 3.22 - Kohaku - January 15th 2020

### Matter Physics

All of the following are specific to the Matter Physics implementation used by Phaser:

#### Matter Physics New Features

* Matter Physics now has 100% JSDoc coverage! Woohoo :)
* Matter Physics now has brand new TypeScript defs included in the `types` folder :)
* `MatterDebugConfig` is a new configuration object that contains all of the following new Matter debug settings:
* `showAxes`- Render all of the body axes?
* `showAngleIndicator`- Render just a single body axis?
* `angleColor`- The color of the body angle / axes lines.
* `showBroadphase`- Render the broadphase grid?
* `broadphaseColor`- The color of the broadphase grid.
* `showBounds`- Render the bounds of the bodies in the world?
* `boundsColor`- The color of the body bounds.
* `showVelocity`- Render the velocity of the bodies in the world?
* `velocityColor`- The color of the body velocity line.
* `showCollisions`- Render the collision points and normals for colliding pairs.
* `collisionColor`- The color of the collision points.
* `showSeparation`- Render lines showing the separation between bodies.
* `separationColor`- The color of the body separation line.
* `showBody`- Render the dynamic bodies in the world to the Graphics object?
* `showStaticBody`- Render the static bodies in the world to the Graphics object?
* `showInternalEdges`- When rendering bodies, render the internal edges as well?
* `renderFill`- Render the bodies using a fill color.
* `renderLine`- Render the bodies using a line stroke.
* `fillColor`- The color value of the fill when rendering dynamic bodies.
* `fillOpacity`- The opacity of the fill when rendering dynamic bodies, a value between 0 and 1.
* `lineColor`- The color value of the line stroke when rendering dynamic bodies.
* `lineOpacity`- The opacity of the line when rendering dynamic bodies, a value between 0 and 1.
* `lineThickness`- If rendering lines, the thickness of the line.
* `staticFillColor`- The color value of the fill when rendering static bodies.
* `staticLineColor`- The color value of the line stroke when rendering static bodies.
* `showSleeping`- Render any sleeping bodies (dynamic or static) in the world to the Graphics object?
* `staticBodySleepOpacity`] - The amount to multiply the opacity of sleeping static bodies by.
* `sleepFillColor`- The color value of the fill when rendering sleeping dynamic bodies.
* `sleepLineColor`- The color value of the line stroke when rendering sleeping dynamic bodies.
* `showSensors`- Render bodies or body parts that are flagged as being a sensor?
* `sensorFillColor`- The fill color when rendering body sensors.
* `sensorLineColor`- The line color when rendering body sensors.
* `showPositions`- Render the position of non-static bodies?
* `positionSize`- The size of the rectangle drawn when rendering the body position.
* `positionColor`- The color value of the rectangle drawn when rendering the body position.
* `showJoint`- Render all world constraints to the Graphics object?
* `jointColor`- The color value of joints when `showJoint` is set.
* `jointLineOpacity`- The line opacity when rendering joints, a value between 0 and 1.
* `jointLineThickness`- The line thickness when rendering joints.
* `pinSize`- The size of the circles drawn when rendering pin constraints.
* `pinColor`- The color value of the circles drawn when rendering pin constraints.
* `springColor`- The color value of spring constraints.
* `anchorColor`- The color value of constraint anchors.
* `anchorSize`- The size of the circles drawn as the constraint anchors.
* `showConvexHulls`- When rendering polygon bodies, render the convex hull as well?
* `hullColor`- The color value of hulls when `showConvexHulls` is set.
* `World.renderBody` is a new method that will render a single Matter Body to the given Graphics object. This is used internally during debug rendering but is also public. This allows you to control which bodies are rendered and to which Graphics object, should you wish to use them in-game and not just during debugging.
* `World.renderConstraint` is a new method that will render a single Matter Constraint, such as a pin or a spring, to the given Graphics object. This is used internally during debug rendering but is also public. This allows you to control which constraints are rendered and to which Graphics object, should you wish to use them in-game and not just during debugging.
* `World.renderConvexHull` is a new method that will render the convex hull of a single Matter Body, to the given Graphics object. This is used internally during debug rendering but is also public. This allows you to control which hulls are rendered and to which Graphics object, should you wish to use them in-game and not just during debugging.
* `World.renderGrid` is a new method that will render the broadphase Grid to the given graphics instance.
* `World.renderBodyBounds` is a new method that will render the bounds of all the given bodies to the given graphics instance.
* `World.renderBodyAxes` is a new method that will render the axes of all the given bodies to the given graphics instance.
* `World.renderBodyVelocity` is a new method that will render a velocity line for all the given bodies to the given graphics instance.
* `World.renderSeparations` is a new method that will render the separations in the current pairs list to the given graphics instance.
* `World.renderCollisions` is a new method that will render the collision points and normals in the current pairs list to the given graphics instance.
* `World.getAllBodies` is a new method that will return all bodies in the Matter World.
* `World.getAllConstraints` is a new method that will return all constraints in the Matter World.
* `World.getAllComposites` is a new method that will return all composites in the Matter World.
* `MatterPhysics.composite` is a new reference to the `Matter.Composite` module for easy access from within a Scene.
* `MatterPhysics.detector` is a new reference to the `Matter.Dectector` module for easy access from within a Scene.
* `MatterPhysics.grid` is a new reference to the `Matter.Grid` module for easy access from within a Scene.
* `MatterPhysics.pair` is a new reference to the `Matter.Pair` module for easy access from within a Scene.
* `MatterPhysics.pairs` is a new reference to the `Matter.Pairs` module for easy access from within a Scene.
* `MatterPhysics.query` is a new reference to the `Matter.Query` module for easy access from within a Scene.
* `MatterPhysics.resolver` is a new reference to the `Matter.Resolver` module for easy access from within a Scene.
* `MatterPhysics.sat` is a new reference to the `Matter.SAT` module for easy access from within a Scene.
* `MatterPhysics.constraint` is a new reference to the `Matter.Constraint` module for easy access from within a Scene.
* `MatterPhysics.composites` is a new reference to the `Matter.Composites` module for easy access from within a Scene.
* `MatterPhysics.axes` is a new reference to the `Matter.Axes` module for easy access from within a Scene.
* `MatterPhysics.bounds` is a new reference to the `Matter.Bounds` module for easy access from within a Scene.
* `MatterPhysics.svg` is a new reference to the `Matter.Svg` module for easy access from within a Scene.
* `MatterPhysics.vector` is a new reference to the `Matter.Vector` module for easy access from within a Scene.
* `MatterPhysics.vertices` is a new reference to the `Matter.Vertices` module for easy access from within a Scene.
* `BEFORE_ADD` is a new Event dispatched by `Matter.World` when a Body or Constraint is about to be added to the World.
* `AFTER_ADD` is a new Event dispatched by `Matter.World` when a Body or Constraint has been added to the World.
* `BEFORE_REMOVE` is a new Event dispatched by `Matter.World` when a Body or Constraint is about to be removed from the World.
* `AFTER_REMOVE` is a new Event dispatched by `Matter.World` when a Body or Constraint has been removed from the World.
* `Body.render.lineOpacity` is a new property on the Matter Body object that allows for custom debug rendering.
* `Body.render.lineThickness` is a new property on the Matter Body object that allows for custom debug rendering.
* `Body.render.fillOpacity` is a new property on the Matter Body object that allows for custom debug rendering.
* `World.setCompositeRenderStyle` is a new method that lets you quickly set the render style values on the children of the given compposite.
* `World.setBodyRenderStyle` is a new method that lets you quickly set the render style values on the given Body.
* `World.setConstraintRenderStyle` is a new method that lets you quickly set the render style values on the given Constraint.
* You can now set `restingThresh` in the Matter Configuration file to adjust the Resolver property.
* You can now set `restingThreshTangent` in the Matter Configuration file to adjust the Resolver property.
* You can now set `positionDampen` in the Matter Configuration file to adjust the Resolver property.
* You can now set `positionWarming` in the Matter Configuration file to adjust the Resolver property.
* You can now set `frictionNormalMultiplier` in the Matter Configuration file to adjust the Resolver property.
* `MatterPhysics.containsPoint` is a new method that returns a boolean if any of the given bodies intersect with the given point.
* `MatterPhysics.intersectPoint` is a new method that checks which bodies intersect with the given point and returns them.
* `MatterPhysics.intersectRect` is a new method that checks which bodies intersect with the given rectangular area, and returns them. Optionally, it can check which bodies are outside of the area.
* `MatterPhysics.intersectRay` is a new method that checks which bodies intersect with the given ray segment and returns them. Optionally, you can set the width of the ray.
* `MatterPhysics.intersectBody` is a new method that checks which bodies intersect with the given body and returns them. If the bodies are set to not collide this can be used as an overlaps check.
* `MatterPhysics.overlap` is a new method that takes a target body and checks to see if it overlaps with any of the bodies given. If they do, optional `process` and `overlap` callbacks are invoked, passing the overlapping bodies to them, along with additional collision data.
* `MatterPhysics.setCollisionCategory` is a new method that will set the collision filter category to the value given, on all of the bodies given. This allows you to easily set the category on bodies that don't have a Phaser Matter Collision component.
* `MatterPhysics.setCollisionGroup` is a new method that will set the collision filter group to the value given, on all of the bodies given. This allows you to easily set the group on bodies that don't have a Phaser Matter Collision component.
* `MatterPhysics.setCollidesWith` is a new method that will set the collision filter mask to the value given, on all of the bodies given. This allows you to easily set the filter mask on bodies that don't have a Phaser Matter Collision component.
* `Matter.Body.centerOfMass` is a new vec2 property added to the Matter Body object that retains the center of mass coordinates when the Body is first created, or has parts added to it. These are float values, derived from the body position and bounds.
* `Matter.Body.centerOffset` is a new vec2 property added to the Matter Body object that retains the center offset coordinates when the Body is first created, or has parts added to it. These are pixel values.
* `Constraint.pointAWorld` is a new method added to Matter that returns the world-space position of `constraint.pointA`, accounting for `constraint.bodyA`.
* `Constraint.pointBWorld` is a new method added to Matter that returns the world-space position of `constraint.pointB`, accounting for `constraint.bodyB`.
* `Body.setCentre` is a new method added to Matter that allows you to set the center of mass of a Body (please note the English spelling of this function.)
* `Body.scale` is a new read-only vector that holds the most recent scale values as passed to `Body.scale`.
* `Matter.Bodies.flagCoincidentParts` is a new function that will flags all internal edges (coincident parts) on an array of body parts. This was previously part of the `fromVertices` function, but has been made external for outside use.
* `Matter.getMatterBodies` is a new function that will return an array of Matter JS Bodies from the given input array, which can be Matter Game Objects, or any class that extends them.
* `Matter.World.has` is a new method that will take a Matter Body, or Game Object, and search the world for it. If found, it will return `true`.
* Matter now has the option to use the Runner that it ships with. The Matter Runner operates in two modes: fixed and variable. In the fixed mode, the Matter Engine updates at a fixed delta value every frame (which is what Phaser has used since the first version). In variable mode, the delta will be smoothed and capped each frame to keep the simulation constant, but at the cost of determininism. You can configure the runner by setting the `runner` property in the Matter Config object, both of which are fully covered with JSDocs. As of 3.22 the runner is now used by default in variable (non-fixed) mode. If you wish to return to the previous behavior, set `runner: { isFixed: true }`.
* `Body.onCollideCallback` is a new Matter Body property that can point to a callback to invoke when the body starts colliding.
* `Body.onCollideEndCallback` is a new Matter Body property that can point to a callback to invoke when the body stops colliding.
* `Body.onCollideActiveCallback` is a new Matter Body property that can point to a callback to invoke for the duration the body is colliding.
* `Body.onCollideWith` is a new Matter Body property that holds a mapping between bodies and collision callbacks.
* `MatterGameObject.setOnCollide` is a new method available on any Matter Game Object, that sets a callback that is invoked when the body collides with another.
* `MatterGameObject.setOnCollideEnd` is a new method available on any Matter Game Object, that sets a callback that is invoked when the body stops colliding.
* `MatterGameObject.setOnCollideActive` is a new method available on any Matter Game Object, that sets a callback which is invoked for the duration of the bodies collision with another.
* `MatterGameObject.setOnCollideWith` is a new method available on any Matter Game Object, that allows you to set a callback to be invoked whenever the body collides with another specific body, or array of bodies.
* `Body.gravityScale` is a new vector property that allows you to scale the effect of world gravity on a specific Body.
* `MatterPhysics._tempVec2` is a new private internal vector used for velocity and force calculations.
* `MatterPhysics.setVelocity` is a new method that will set both the horizontal and vertical linear velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.setVelocityX` is a new method that will set the horizontal linear velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.setVelocityY` is a new method that will set the vertical linear velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.setAngularVelocity` is a new method that will set the angular velocity of the given physics bodies. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.applyForce` is a new method that applies a force to a body, at the bodies current position, including resulting torque. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.applyForceFromPosition` is a new method that applies a force to a body from the given world position, including resulting torque. If no angle is given, the current body angle is used. This can be used on all Matter bodies, not just those created via the factory.
* `MatterPhysics.fromSVG` is a new method that allows you to create a Body from the given SVG path data.
* The `Matter.Factory.velocity` method has been removed. Please now use `MatterPhysics.setVelocity` instead.
* The `Matter.Factory.angularVelocity` method has been removed. Please now use `MatterPhysics.setAngularVelocity` instead.
* The `Matter.Factory.force` method has been removed. Please now use `MatterPhysics.applyForce` instead.
* `MatterBodyConfig` is a new type def that contains all of the Body configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterBodyRenderConfig` is a new type def that contains all of the Body debug rendering configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterChamferConfig` is a new type def that contains all of the chamfer configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterCollisionFilter` is a new type def that contains all of the collision configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterConstraintConfig` is a new type def that contains all of the constraint configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterConstraintRenderConfig` is a new type def that contains all of the Constraint debug rendering configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterSetBodyConfig` is a new type def that contains all of the Constraint debug rendering configuration properties. This is now used through-out the JSDocs to aid in code-completion.
* `MatterPhysics.getConstraintLength` is a new method that will return the length of the given constraint, as this is something you cannot get from the constraint properties directly.
* `MatterPhysics.alignBody` is a new method that will align a Body, or Matter Game Object, against the given coordinates, using the given alignment constant. For example, this allows you to easily position a body to the `BOTTOM_LEFT`, or `TOP_CENTER`, or a coordinate. Alignment is based on the body bounds.
* `Phaser.Types.Physics.Matter.MatterBody` is a new type def that contains all of the valid Matter Body objects. This is now used through-out the JSDocs to aid in code-completion.
* `Matter.BodyBounds` is a new class that contains methods to help you extract world coordinates from various points around the bounds of a Matter Body. Because Matter bodies are positioned based on their center of mass, and not a dimension based center, you often need to get the bounds coordinates in order to properly align them in the world. You can access this new class via `this.matter.bodyBounds`.
* The method signature for `Matter.PhysicsEditorParser.parseBody` has changed. It now takes `(x, y, config, options)` and no longer has `width` and `height` parameters. Please see the updated documentation for more details if you were calling this method directly.
* `MatterPhysics.fromPhysicsEditor` is a new method that allows you to create a Matter Body based on the given PhysicsEditor shape data. Previously, you could only using PhysicsEditor data with a Matter Game Object, but now you can create a body directly using it.
* `Matter.PhysicsJSONParser` is a new parser that will create Matter bodies from JSON physics data files. Currently onto the Phaser Physics Tracer app exports in this format, but details are published in the JSDocs, so any app can do so.
* `Matter.Factory.fromJSON` is a new method that will create a body from a JSON physics data file.
* The `SetBody` Matter component can now automatically use shapes created in the Phaser Physics Tracer App in the JSON data format.
* `Matter.Components.Sleep.setToSleep` is a new method available on any Matter Game Object that will send the body to sleep, if Engine sleeping has been enabled.
* `Matter.Components.Sleep.setAwake` is a new method available on any Matter Game Object that will awake a body from sleep, if Engine sleeping has been enabled.

#### Matter Physics Updates

* The `debug` property in the Matter World Config is now a `MatterDebugConfig` option instead of a boolean. However, if a boolean is given, it will use the default debug config values.
* The following `MatterWorldConfig` options have now been removed: `debugShowBody`, `debugShowStaticBody`, `debugBodyColor`, `debugBodyFillColor`, `debugStaticBodyColor`, `debugShowJoint`, `debugJointColor`, `debugWireframes`, `debugShowInternalEdges`, `debugShowConvexHulls`, `debugConvexHullColor` and `debugShowSleeping`. These can all be set via the new `MatterDebugConfig` object instead.
* The object `World.defaults` has been removed. Defaults are now access via `World.debugDefaults`.
* `World.renderBodies` has been rewritten to cache commonly-used values and avoid a situation when a single body would be rendered twice.
* The private method `World.renderConvexHulls` has been removed as it's no longer used internally.
* The private method `World.renderWireframes` has been removed as it's no longer used internally.
* The method `World.fromPath` has been removed. This was never used internally and you can get the same results by calling `Vertices.fromPath`.
* The `World.setBounds` argument `thickness` now defaults to 64, not 128, to keep it matching the Matter World Config.
* The `Body.render.fillStyle` property that existed on the Matter Body object has been removed and replaced with `fillColor`.
* The `Body.render.strokeStyle` property that existed on the Matter Body object has been removed and replaced with `lineColor`.
* `Matter.Body.render.sprite.xOffset` and `yOffset` are no longer set to anything when a Body is created. They are left as zero, or you can override them in the Body config, in which case the value is added to the sprite origin offset during a call to `setExistingBody`.
* The `Matter.Mass.centerOfMass` component property now returns the pre-calculated Body `centerOfMass` property, which is much more accurate than the previous bounds offset value.
* `Matter.setExistingBody`, which is called interally whenever a Body is set on a Game Object, now uses the new `centerOffset` values to ensure that the texture frame is correctly centered based on the center of mass, not the Body bounds, allowing for much more accurate body to texture mapping with complex multi-part compound bodies.
* The `Matter.PhysicsEditorParser` has been updated so it no longer needs to set the render offsets, and instead uses the center of mass values.
* If the `Matter.Body` config doesn't contain a `position` property, it will now default to using `Vertices.centre(body.vertices)` as the position. In most cases, this is what you need, so it saves having to pass it in the config object.
* Bumped Matter Plugin versions to avoid console logs from Common.info and Common.warn.
* `PhysicsEditorParser.parseVertices` now uses `Bodies.flagCoincidentParts` to avoid duplicating code.
* `MatterGameObject` has a new optional boolean constructor parameter `addToWorld` which lets you control if the Body should be added to the world or not. Useful for toggling off should you be merging pre-existing bodies with Game Objects.
* The `Matter.SetBody.setExistingBody` function, which all Matter Game Objects have, has a new parameter `addToWorld` which allows you to control when the body is added to the Matter world should you not require it immediately. It will also only add the body to the world if it doesn't already exist within it, or any of its composites.
* `PointerConstraint` has been recoded so that when pressed down, it only polls the World for a body hit test during the next game update. This stops it coming out of sync with the state of the world. Use of the constraint remains the same as before.
* You can now set `gravity: false` in your Matter Config and it will reset gravity from the defaults to zero.
* The internal Matter `Composite.setModified` function will now emit a `compositeModified` event, which the Matter World listens for, if debug draw is enabled, so it can update the composite children render styles.
* `Matter.PhysicsEditorParser.parseBody` can now accept a MatterBodyConfig file as a 4th parameter. This allows you to set Body properties when the body is created, overriding whatever values may have been set in the PhysicsEditor JSON.

#### Matter Physics Bug Fixes

* Due to the rewrite of the debug rendering, it is now possible to render _just_ constraints, where-as before this was only possible if bodies were being rendered as well. Fix #4880 (thanks @roberto257)
* `Matter.PhysicsEditorParser` had a bug where it would allow fixtures with non-clockwise sorted vertices through, which would break pointer constraint interaction with these bodies. The parser now sorts the vertices properly. Fix #4261 (thanks @Sanchez3)

### New Features

* `TimeStep.smoothStep` is a new boolean property that controls if any delta smoothing takes place during the game step. Delta smoothing has been enabled in Phaser since the first version and helps avoid delta spikes and dips, especially after loss of focus. However, you can now easily toggle if this happens via this property and the corresponding `FPSConfig` property.
* `Phaser.Math.Distance.BetweenPoints` is a new function that will return the distance between two Vector2-like objects (thanks @samme)
* `Phaser.Math.Distance.BetweenPointsSquared` is a new function that will return the squared distance between two Vector2-like objects (thanks @samme)
* `Phaser.Math.Distance.Chebyshev` is a new function that will return the Chebyshev (or chessboard) distance between two Vector2-like objects (thanks @samme)
* `Phaser.Math.Distance.Snake` is a new function that will return the rectilinear distance between two Vector2-like objects (thanks @samme)
* `ParticleEmitter.setTint` is a new method that will set the tint of emitted particles for the given Emitter only (thanks @samme)
* `ParticleEmitter.remove` is a new method that will remove the Emitter from its Emitter Manager (thanks @samme)
* `ParticleEmitterManager.removeEmitter` is a new method that will remove the given emitter from the manager, if the emitter belongs to it (thanks @samme)
* `AlphaSingle` is a new Game Object Component that allows a Game Object to set its alpha values, but only as a single uniform value, not on a per-quad basis.
* `Actions.AlignTo` (in combination with the new `Display.Align.To.QuickSet` function) allows you to align an array of Game Objects so they sit next to each other, one at a time. The first item isn't moved, the second is moved to sit next to the first, and so on. You can align them using any of the alignment constants (thanks @samme)
* `Scene.Systems.getData` is a new method that will return any data that was sent to the Scene by another Scene, i.e. during a `run` or `launch` command. You can access it via `this.sys.getData()` from within your Scene.
* `Group.internalCreateCallback` is a new optional callback that is invoked whenever a child is added to a Group. This is the same as `createCallback` except it's only for use by the parent class, allowing a parent to invoke a creation callback and for you to still provide one via the Group config.
* `Group.internalRemoveCallback` is a new optional callback that is invoked whenever a child is removed from a Group. This is the same as `removeCallback` except it's only for use by the parent class, allowing a parent to invoke a callback and for you to still provide one via the Group config.

### Updates

* `Body.deltaXFinal` is a new method on Arcade Physics Bodies that will return the final change in the horizontal position of the body, as based on all the steps that took place this frame. This property is calculated during the `postUpdate` phase, so must be listened for accordingly (thanks Bambosh)
* `Body.deltaYFinal` is a new method on Arcade Physics Bodies that will return the final change in the vertical position of the body, as based on all the steps that took place this frame. This property is calculated during the `postUpdate` phase, so must be listened for accordingly (thanks Bambosh)
* `Body._tx` is a new internal private var, holding the Arcade Physics Body combined total delta x value.
* `Body._ty` is a new internal private var, holding the Arcade Physics Body combined total delta y value.
* `LineCurve.getUtoTmapping` has been updated to return `u` directly to avoid calculations as it's identical to `t` in a Line (thanks @rexrainbow)
* `Curve.getSpacedPoints` will now take an optional array as the 3rd parameter to store the points results in (thanks @rexrainbow)
* Trying to play or resume an audio file with an incorrect key will now throw a runtime error, instead of a console warning (thanks @samme)
* The `Shape` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the shape, rather than a quad alpha, which never worked for Shape objects.
* The `Container` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the container, rather than a quad alpha, which never worked consistently across Container children. Fix #4916 (thanks @laineus)
* The `DOMElement` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the element, rather than a quad alpha, which never worked for these objects.
* The `Graphics` Game Object now uses the AlphaSingle component, allowing you to uniformly set the alpha of the element, rather than a quad alpha, which never worked for these objects.
* `TweenData` has a new property called `previous` which holds the eased property value prior to the update.
* The `TWEEN_UPDATE` event now sends two new parameters to the handler: `current` and `previous` which contain the current and previous property values.
* During `collideSpriteVsGroup` checks it will now skip bodies that are disabled to save doing a `contains` test (thanks @samme)
* `Display.Align.In.QuickSet` now accepts `LEFT_BOTTOM` as `BOTTOM_LEFT`, `LEFT_TOP` as `TOP_LEFT`, `RIGHT_BOTTOM` as `BOTTOM_RIGHT` and `RIGHT_TOP` as `TOP_RIGHT`. Fix #4927 (thanks @zaniar)
* `PhysicsGroup` now uses the new `internalCreateCallback` and `internalRemoveCallback` to handle its body creation and destruction, allowing you to use your own `createCallback` and `removeCallback` as defined in the Group config. Fix #4420 #4657 #4822 (thanks @S4n60w3n @kendistiller @scrubperson)
* `DOMElement` has a new private method `handleSceneEvent` which will handle toggling the display setting of the element when a Scene sleeps and wakes. A DOM Element will now listen for the Scene sleep and wake events. These event listeners are removed in the `preDestroy` method.
* A `DOMElement` will now set the display mode to 'none' during its render if the Scene in which it belongs is no longer visible.

### Bug Fixes

* BitmapText with a `maxWidth` set wouldn't update the text correctly if it was modified post-creation. You can now update the text and/or width independantly and it'll update correctly. Fix #4881 (thanks @oxguy3)
* Text objects will no longer add any white-space when word-wrapping if the last line is only one word long. Fix #4867 (thanks @gaamoo @rexrainbow)
* When `Game.destroy` is running, Scenes are now destroyed _before_ plugins, avoiding bugs when closing down plugins and deleting Render Textures. Fix #4849 #4876 (thanks @rexrainbow @siyuanqiao)
* The `Mesh` and `Quad` Game Objects have had the `GetBounds` component removed as it cannot operate on a Mesh as they don't have origins. Fix #4902 (thanks @samme)
* Setting `lineSpacing` in the Text Game Object style config would set the value but not apply it to the Text, leaving you to call `updateText` yourself. If set, it's now applied on instantiation. Fix #4901 (thanks @FantaZZ)
* External calls to the Fullscreen API using `element.requestFullscreen()` would be blocked by the Scale Manager. The Scale Manager will no longer call `stopFullScreen` should it be triggered outside of Phaser (thanks @AdamXA)
* The `Tilemaps.Tile.tint` property wasn't working correctly as it expected the colors in the wrong order (BGR instead of RGB). It will now expect them in the correct RGB order (thanks @Aedalus @plissken2013es)
* The `ScaleManager.destroy` method wasn't being called when the Game `DESTROY` event was dispatched, causing minor gc to build up. The destroy method will now be called properly on game destruction. Fix #4944 (thanks @sunshineuoow)
* `FacebookInstantGamesPlugin.showAd` and `showVideo` will now break out of the ad iteration search once a valid ad has been found and called. Previously, it would carry on interating if the async didn't complete quickly. Fix #4888 (thanks @east62687)
* When playing an Animation, if you were to play another, then pause it, then play another the internal `_paused` wouldn't get reset, preventing you from them pausing the animations from that point on. You can now play and pause animations at will. Fix #4835 (thanks @murteira)
* In `Actions.GridAlign` if you set `width` to -1 it would align the items vertically, instead of horizontally. It now aligns them horizontally if `width` is set, or vertically if `height` is set. Fix #4899 (thanks @BenjaVR)
* A `PathFollower` with a very short duration would often not end in the correct place, which is the very end of the Path, due to the tween handling the movement not running one final update when the tween was complete. It will now always end at the final point of the path, no matter how short the duration. Fix #4950 (thanks @bramp)
* A `DOMElement` would still remain visible even if the Scene in which it belongs to was sent to sleep. A sleeping Scene shouldn't render anything. DOM Elements will now respond to sleep and wake events from their parent Scene. Fix #4870 (thanks @peonmodel)
* If a config object was passed to `MultiAtlasFile` it expected the atlas URL to be in the `url` property, however the docs and file config expected it in `atlasURL`. You can now use either of these properties to declare the url. Fix #4815 (thanks @xense)

### Examples, Documentation and TypeScript

My thanks to the following for helping with the Phaser 3 Examples, Docs and TypeScript definitions, either by reporting errors, fixing them or helping author the docs:

@fselcukcan Bambosh @louisth @hexus @javigaralva @samme @BeLi4L @jcyuan @javigaralva @T-Grave @bramp @Chnapy @dranitski @RollinSafary @xense

The Matter TypeScript defs have been updated to include lots of missing classes, removed some redundant elements and general fixes. The Phaser TypeScript defs now reference the Matter defs directly and no longer try to parse them from the JSDocs. This allows the `MatterJS` namespace to work in TypeScript projects without any compilation warnings.

The Spine Plugin now has new TypeScript defs in the `types` folder thanks to @supertommy
