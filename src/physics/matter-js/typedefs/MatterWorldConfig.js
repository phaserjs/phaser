/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterWorldConfig
 * @since 3.0.0
 *
 * @property {(Phaser.Types.Math.Vector2Like|boolean)} [gravity] - Sets {@link Phaser.Physics.Matter.World#gravity}. If `false` Gravity will be set to zero.
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
 * @property {boolean} [plugins.attractors=false] - Should the Matter Attractor Plugin be enabled? An attractors plugin that makes it easy to apply continual forces on bodies. It's possible to simulate effects such as wind, gravity and magnetism.
 * @property {boolean} [plugins.wrap=false] - Should the Matter Wrap Plugin be enabled? A coordinate wrapping plugin that automatically wraps the position of bodies such that they always stay within the given bounds. Upon crossing a boundary the body will appear on the opposite side of the bounds, while maintaining its velocity.
 * @property {boolean} [plugins.collisionevents=true] - Should the Matter Collision Events Plugin be enabled?
 * @property {boolean} [enabled=true] - Toggles if the world is enabled or not.
 * @property {number} [correction=1] - An optional Number that specifies the time correction factor to apply to the update.
 * @property {function} [getDelta] - This function is called every time the core game loop steps, which is bound to the Request Animation Frame frequency unless otherwise modified.
 * @property {boolean} [autoUpdate=true] - Automatically call Engine.update every time the game steps.
 * @property {number} [restingThresh=4] - Sets the Resolver resting threshold property.
 * @property {number} [restingThreshTangent=6] - Sets the Resolver resting threshold tangent property.
 * @property {number} [positionDampen=0.9] - Sets the Resolver position dampen property.
 * @property {number} [positionWarming=0.8] - Sets the Resolver position warming property.
 * @property {number} [frictionNormalMultiplier=5] - Sets the Resolver friction normal multiplier property.
 * @property {(boolean|Phaser.Types.Physics.Matter.MatterDebugConfig)} [debug=false] - Controls the Matter Debug Rendering options. If a boolean it will use the default values, otherwise, specify a Debug Config object.
 * @property {Phaser.Types.Physics.Matter.MatterRunnerConfig} [runner] - Sets the Matter Runner options.
 */
