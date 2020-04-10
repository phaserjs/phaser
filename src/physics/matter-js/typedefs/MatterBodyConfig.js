/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterBodyConfig
 * @since 3.22.0
 * 
 * @property {string} [label='Body'] - An arbitrary string-based name to help identify this body.
 * @property {MatterJS.BodyType[]} [parts] - An array of bodies that make up this body. The first body in the array must always be a self reference to the current body instance. All bodies in the `parts` array together form a single rigid compound body.
 * @property {any} [plugin] - An object reserved for storing plugin-specific properties.
 * @property {number} [angle=0] - A number specifying the angle of the body, in radians.
 * @property {Phaser.Types.Math.Vector2Like[]} [vertices=null] - An array of `Vector` objects that specify the convex hull of the rigid body. These should be provided about the origin `(0, 0)`.
 * @property {Phaser.Types.Math.Vector2Like} [position] - A `Vector` that specifies the current world-space position of the body.
 * @property {Phaser.Types.Math.Vector2Like} [force] - A `Vector` that specifies the force to apply in the current step. It is zeroed after every `Body.update`. See also `Body.applyForce`.
 * @property {number} [torque=0] - A `Number` that specifies the torque (turning force) to apply in the current step. It is zeroed after every `Body.update`.
 * @property {boolean} [isSensor=false] - A flag that indicates whether a body is a sensor. Sensor triggers collision events, but doesn't react with colliding body physically.
 * @property {boolean} [isStatic=false] - A flag that indicates whether a body is considered static. A static body can never change position or angle and is completely fixed.
 * @property {number} [sleepThreshold=60] - A `Number` that defines the number of updates in which this body must have near-zero velocity before it is set as sleeping by the `Matter.Sleeping` module (if sleeping is enabled by the engine).
 * @property {number} [density=0.001] - A `Number` that defines the density of the body, that is its mass per unit area. If you pass the density via `Body.create` the `mass` property is automatically calculated for you based on the size (area) of the object. This is generally preferable to simply setting mass and allows for more intuitive definition of materials (e.g. rock has a higher density than wood).
 * @property {number} [restitution=0] - A `Number` that defines the restitution (elasticity) of the body. The value is always positive and is in the range `(0, 1)`.
 * @property {number} [friction=0.1] - A `Number` that defines the friction of the body. The value is always positive and is in the range `(0, 1)`. A value of `0` means that the body may slide indefinitely. A value of `1` means the body may come to a stop almost instantly after a force is applied.
 * @property {number} [frictionStatic=0.5] - A `Number` that defines the static friction of the body (in the Coulomb friction model). A value of `0` means the body will never 'stick' when it is nearly stationary and only dynamic `friction` is used. The higher the value (e.g. `10`), the more force it will take to initially get the body moving when nearly stationary. This value is multiplied with the `friction` property to make it easier to change `friction` and maintain an appropriate amount of static friction.
 * @property {number} [frictionAir=0.01] - A `Number` that defines the air friction of the body (air resistance). A value of `0` means the body will never slow as it moves through space. The higher the value, the faster a body slows when moving through space.
 * @property {Phaser.Types.Physics.Matter.MatterCollisionFilter} [collisionFilter] - An `Object` that specifies the collision filtering properties of this body.
 * @property {number} [slop=0.05] - A `Number` that specifies a tolerance on how far a body is allowed to 'sink' or rotate into other bodies. Avoid changing this value unless you understand the purpose of `slop` in physics engines. The default should generally suffice, although very large bodies may require larger values for stable stacking.
 * @property {number} [timeScale=1] - A `Number` that allows per-body time scaling, e.g. a force-field where bodies inside are in slow-motion, while others are at full speed.
 * @property {(number|number[]|Phaser.Types.Physics.Matter.MatterChamferConfig)} [chamfer=null] - A number, or array of numbers, to chamfer the vertices of the body, or a full Chamfer configuration object.
 * @property {number} [circleRadius=0] - The radius of this body if a circle.
 * @property {number} [mass=0] - A `Number` that defines the mass of the body, although it may be more appropriate to specify the `density` property instead. If you modify this value, you must also modify the `body.inverseMass` property (`1 / mass`).
 * @property {number} [inverseMass=0] - A `Number` that defines the inverse mass of the body (`1 / mass`). If you modify this value, you must also modify the `body.mass` property.
 * @property {Phaser.Types.Math.Vector2Like} [scale] - A `Vector` that specifies the initial scale of the body.
 * @property {Phaser.Types.Math.Vector2Like} [gravityScale] - A `Vector` that scales the influence of World gravity when applied to this body.
 * @property {boolean} [ignoreGravity=false] - A boolean that toggles if this body should ignore world gravity or not.
 * @property {boolean} [ignorePointer=false] - A boolean that toggles if this body should ignore pointer / mouse constraints or not.
 * @property {Phaser.Types.Physics.Matter.MatterBodyRenderConfig} [render] - The Debug Render configuration object for this body.
 * @property {function} [onCollideCallback] - A callback that is invoked when this Body starts colliding with any other Body. You can register callbacks by providing a function of type `( pair: Matter.Pair) => void`.
 * @property {function} [onCollideEndCallback] - A callback that is invoked when this Body stops colliding with any other Body. You can register callbacks by providing a function of type `( pair: Matter.Pair) => void`.
 * @property {function} [onCollideActiveCallback] - A callback that is invoked for the duration that this Body is colliding with any other Body. You can register callbacks by providing a function of type `( pair: Matter.Pair) => void`.
 * @property {any} [onCollideWith] - A collision callback dictionary used by the `Body.setOnCollideWith` function.
 */
