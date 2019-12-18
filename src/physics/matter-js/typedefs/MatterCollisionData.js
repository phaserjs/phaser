/**
 * @typedef {object} Phaser.Types.Physics.Matter.MatterCollisionData
 * @since 3.22.0
 * 
 * @property {boolean} collided - Have the pair collided or not?
 * @property {MatterJS.Body} bodyA - A reference to the first body involved in the collision.
 * @property {MatterJS.Body} bodyB - A reference to the second body involved in the collision.
 * @property {MatterJS.Body} axisBody - A reference to the dominant axis body.
 * @property {number} axisNumber - The index of the dominant collision axis vector (edge normal)
 * @property {number} depth - The depth of the collision on the minimum overlap.
 * @property {MatterJS.Body} parentA - A reference to the parent of Body A, or to Body A itself if it has no parent.
 * @property {MatterJS.Body} parentB - A reference to the parent of Body B, or to Body B itself if it has no parent.
 * @property {vector} normal - The collision normal, facing away from Body A.
 * @property {vector} tangent - The tangent of the collision normal.
 * @property {vector} penetration - The penetration distances between the two bodies.
 * @property {vector[]} supports - An array of support points, either exactly one or two points.
 * @property {number} inverseMass - The resulting inverse mass from the collision.
 * @property {number} friction - The resulting friction from the collision.
 * @property {number} frictionStatic - The resulting static friction from the collision.
 * @property {number} restitution - The resulting restitution from the collision.
 * @property {number} slop - The resulting slop from the collision.
 */
