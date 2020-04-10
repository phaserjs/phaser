/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionData
 * @since 3.22.0
 * 
 * @property {boolean} collided - Have the pair collided or not?
 * @property {MatterJS.BodyType} bodyA - A reference to the first body involved in the collision.
 * @property {MatterJS.BodyType} bodyB - A reference to the second body involved in the collision.
 * @property {MatterJS.BodyType} axisBody - A reference to the dominant axis body.
 * @property {number} axisNumber - The index of the dominant collision axis vector (edge normal)
 * @property {number} depth - The depth of the collision on the minimum overlap.
 * @property {MatterJS.BodyType} parentA - A reference to the parent of Body A, or to Body A itself if it has no parent.
 * @property {MatterJS.BodyType} parentB - A reference to the parent of Body B, or to Body B itself if it has no parent.
 * @property {MatterJS.Vector} normal - The collision normal, facing away from Body A.
 * @property {MatterJS.Vector} tangent - The tangent of the collision normal.
 * @property {MatterJS.Vector} penetration - The penetration distances between the two bodies.
 * @property {MatterJS.Vector[]} supports - An array of support points, either exactly one or two points.
 * @property {number} inverseMass - The resulting inverse mass from the collision.
 * @property {number} friction - The resulting friction from the collision.
 * @property {number} frictionStatic - The resulting static friction from the collision.
 * @property {number} restitution - The resulting restitution from the collision.
 * @property {number} slop - The resulting slop from the collision.
 */
