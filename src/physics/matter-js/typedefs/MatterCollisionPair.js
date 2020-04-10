/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionPair
 * @since 3.22.0
 * 
 * @property {string} id - The unique auto-generated collision pair id. A combination of the body A and B IDs.
 * @property {MatterJS.BodyType} bodyA - A reference to the first body involved in the collision.
 * @property {MatterJS.BodyType} bodyB - A reference to the second body involved in the collision.
 * @property {MatterJS.Vector[]} activeContacts - An array containing all of the active contacts between bodies A and B.
 * @property {number} separation - The amount of separation that occured between bodies A and B.
 * @property {boolean} isActive - Is the collision still active or not?
 * @property {boolean} confirmedActive - Has Matter determined the collision are being active yet?
 * @property {boolean} isSensor - Is either body A or B a sensor?
 * @property {number} timeCreated - The timestamp when the collision pair was created.
 * @property {number} timeUpdated - The timestamp when the collision pair was most recently updated.
 * @property {Phaser.Types.Physics.Matter.MatterCollisionData} collision - The collision data object.
 * @property {number} inverseMass - The resulting inverse mass from the collision.
 * @property {number} friction - The resulting friction from the collision.
 * @property {number} frictionStatic - The resulting static friction from the collision.
 * @property {number} restitution - The resulting restitution from the collision.
 * @property {number} slop - The resulting slop from the collision.
 */
