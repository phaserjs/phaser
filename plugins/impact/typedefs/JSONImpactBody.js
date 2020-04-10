/**
 * @typedef {object} Phaser.Types.Physics.Impact.JSONImpactBody
 * @since 3.0.0
 *
 * @property {string} name - [description]
 * @property {Phaser.Types.Math.Vector2Like} size - [description]
 * @property {Phaser.Types.Math.Vector2Like} pos - The entity's position in the game world.
 * @property {Phaser.Types.Math.Vector2Like} vel - Current velocity in pixels per second.
 * @property {Phaser.Types.Math.Vector2Like} accel - Current acceleration to be added to the entity's velocity per second. E.g. an entity with a `vel.x` of 0 and `accel.x` of 10 will have a `vel.x` of 100 ten seconds later.
 * @property {Phaser.Types.Math.Vector2Like} friction - Deceleration to be subtracted from the entity's velocity per second. Only applies if `accel` is 0.
 * @property {Phaser.Types.Math.Vector2Like} maxVel - The maximum velocity a body can move.
 * @property {number} gravityFactor - [description]
 * @property {number} bounciness - [description]
 * @property {number} minBounceVelocity - [description]
 * @property {Phaser.Physics.Impact.TYPE} type - [description]
 * @property {Phaser.Physics.Impact.TYPE} checkAgainst - [description]
 * @property {Phaser.Physics.Impact.COLLIDES} collides - [description]
 */
