var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Shape = require('../shapes/Shape')
,   Particle = require('../shapes/Particle')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')

module.exports = NaiveBroadphase;

/**
 * Naive broadphase implementation. Does N^2 tests.
 *
 * @class NaiveBroadphase
 * @constructor
 * @extends Broadphase
 */
function NaiveBroadphase(){
    Broadphase.apply(this);
};
NaiveBroadphase.prototype = new Broadphase();

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
NaiveBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = world.bodies,
        result = this.result,
        i, j, bi, bj;

    result.length = 0;

    for(i=0, Ncolliding=bodies.length; i!==Ncolliding; i++){
        bi = bodies[i];

        for(j=0; j<i; j++){
            bj = bodies[j];

            if(Broadphase.boundingRadiusCheck(bi,bj))
                result.push(bi,bj);
        }
    }

    return result;
};
