/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterConstraintConfig
 * @since 3.22.0
 * 
 * @property {string} [label='Constraint'] - An arbitrary string-based name to help identify this constraint.
 * @property {MatterJS.BodyType} [bodyA] - The first possible `Body` that this constraint is attached to.
 * @property {MatterJS.BodyType} [bodyB] - The second possible `Body` that this constraint is attached to.
 * @property {Phaser.Types.Math.Vector2Like} [pointA] - A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyA` if defined, otherwise a world-space position.
 * @property {Phaser.Types.Math.Vector2Like} [pointB] - A `Vector` that specifies the offset of the constraint from center of the `constraint.bodyB` if defined, otherwise a world-space position.
 * @property {number} [stiffness=1] - A `Number` that specifies the stiffness of the constraint, i.e. the rate at which it returns to its resting `constraint.length`. A value of `1` means the constraint should be very stiff. A value of `0.2` means the constraint acts like a soft spring.
 * @property {number} [angularStiffness=0] - A `Number` that specifies the angular stiffness of the constraint.
 * @property {number} [angleA=0] - The angleA of the constraint. If bodyA is set, the angle of bodyA is used instead.
 * @property {number} [angleB=0] - The angleB of the constraint. If bodyB is set, the angle of bodyB is used instead.
 * @property {number} [damping=0] - A `Number` that specifies the damping of the constraint, i.e. the amount of resistance applied to each body based on their velocities to limit the amount of oscillation. Damping will only be apparent when the constraint also has a very low `stiffness`. A value of `0.1` means the constraint will apply heavy damping, resulting in little to no oscillation. A value of `0` means the constraint will apply no damping.
 * @property {number} [length] - A `Number` that specifies the target resting length of the constraint. It is calculated automatically in `Constraint.create` from initial positions of the `constraint.bodyA` and `constraint.bodyB`.
 * @property {any} [plugin] - An object reserved for storing plugin-specific properties.
 * @property {Phaser.Types.Physics.Matter.MatterConstraintRenderConfig} [render] - The Debug Render configuration object for this constraint.
 */
