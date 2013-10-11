var vec2 = require('../math/vec2')
,   Nearphase = require('./Nearphase')
,   Shape = require('./../shapes/Shape')

module.exports = Broadphase;

/**
 * Base class for broadphase implementations.
 * @class Broadphase
 * @constructor
 */
function Broadphase(){
    this.result = [];
};

/**
 * Get all potential intersecting body pairs.
 * @method getCollisionPairs
 * @param  {World} world The world to search in.
 * @return {Array} An array of the bodies, ordered in pairs. Example: A result of [a,b,c,d] means that the potential pairs are: (a,b), (c,d).
 */
Broadphase.prototype.getCollisionPairs = function(world){
    throw new Error("getCollisionPairs must be implemented in a subclass!");
};

// Temp things
var dist = vec2.create(),
    worldNormal = vec2.create(),
    yAxis = vec2.fromValues(0,1);

/**
 * Check whether the bounding radius of two bodies overlap.
 * @method  boundingRadiusCheck
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Boolean}
 */
Broadphase.boundingRadiusCheck = function(bodyA, bodyB){
    vec2.sub(dist, bodyA.position, bodyB.position);
    var d2 = vec2.squaredLength(dist),
        r = bodyA.boundingRadius + bodyB.boundingRadius;
    return d2 <= r*r;
};
