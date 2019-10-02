/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterWorldConfig
 * @since 3.0.0
 *
 * @property {Phaser.Types.Math.Vector2Like} [gravity] - Sets {@link Phaser.Physics.Matter.World#gravity}.
 * @property {(object|boolean)} [setBounds] - Should the world have bounds enabled by default?
 * @property {number} [setBounds.x=0] - The x coordinate of the world bounds.
 * @property {number} [setBounds.y=0] - The y coordinate of the world bounds.
 * @property {number} [setBounds.width] - The width of the world bounds.
 * @property {number} [setBounds.height] - The height of the world bounds.
 * @property {number} [setBounds.thickness=64] - The thickness of the walls of the world bounds.
 * @property {boolean} [setBounds.left=true] - Should the left-side world bounds wall be created?
 * @property {boolean} [setBounds.right=true] - Should the right-side world bounds wall be created?
 * @property {boolean} [setBounds.top=true] - Should the top world bounds wall be created?
 * @property {boolean} [setBounds.bottom=true] - Should the bottom world bounds wall be created?
 * @property {number} [positionIterations=6] - The number of position iterations to perform each update. The higher the value, the higher quality the simulation will be at the expense of performance.
 * @property {number} [velocityIterations=4] - The number of velocity iterations to perform each update. The higher the value, the higher quality the simulation will be at the expense of performance.
 * @property {number} [constraintIterations=2] - The number of constraint iterations to perform each update. The higher the value, the higher quality the simulation will be at the expense of performance.
 * @property {boolean} [enableSleeping=false] - A flag that specifies whether the engine should allow sleeping via the `Matter.Sleeping` module. Sleeping can improve stability and performance, but often at the expense of accuracy.
 * @property {number} [timing.timestamp=0] - A `Number` that specifies the current simulation-time in milliseconds starting from `0`. It is incremented on every `Engine.update` by the given `delta` argument.
 * @property {number} [timing.timeScale=1] - A `Number` that specifies the global scaling factor of time for all bodies. A value of `0` freezes the simulation. A value of `0.1` gives a slow-motion effect. A value of `1.2` gives a speed-up effect.
 * @property {boolean} [enabled=true] - Toggles if the world is enabled or not.
 * @property {number} [correction=1] - An optional Number that specifies the time correction factor to apply to the update.
 * @property {function} [getDelta] - This function is called every time the core game loop steps, which is bound to the Request Animation Frame frequency unless otherwise modified.
 * @property {boolean} [autoUpdate=true] - Automatically call Engine.update every time the game steps.
 * @property {boolean} [debug=false] - Sets if Matter will render to the debug Graphic overlay. Do not enable this in production.
 * @property {boolean} [debugShowBody=true] - Should dynamic bodies be drawn to the debug graphic?
 * @property {boolean} [debugShowStaticBody=true] - Should static bodies be drawn to the debug graphic?
 * @property {boolean} [debugShowVelocity=true] - Should the velocity vector be drawn to the debug graphic?
 * @property {number} [debugBodyColor=0xff00ff] - The color that dynamic body debug outlines are drawn in.
 * @property {number} [debugBodyFillColor=0xe3a7e3] - The color that dynamic body debug fills are drawn in.
 * @property {number} [debugStaticBodyColor=0x0000ff] - The color that static body debug outlines are drawn in.
 * @property {number} [debugVelocityColor=0x00ff00] - The color that the debug velocity vector lines are drawn in.
 * @property {boolean} [debugShowJoint=true] - Render joints to the debug graphic.
 * @property {number} [debugJointColor=0x000000] - The color that the debug joints are drawn in.
 * @property {boolean} [debugWireframes=true] - Render the debug output as wireframes.
 * @property {boolean} [debugShowInternalEdges=false] - Render internal edges to the debug.
 * @property {boolean} [debugShowConvexHulls=false] - Render convex hulls to the debug.
 * @property {number} [debugConvexHullColor=0xaaaaaa] - The color that the debug convex hulls are drawn in, if enabled.
 * @property {boolean} [debugShowSleeping=false] - Render sleeping bodies the debug.
 */
