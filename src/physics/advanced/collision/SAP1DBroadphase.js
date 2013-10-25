var Circle = require('../shapes/Circle')
,   Plane = require('../shapes/Plane')
,   Shape = require('../shapes/Shape')
,   Particle = require('../shapes/Particle')
,   Broadphase = require('../collision/Broadphase')
,   vec2 = require('../math/vec2')

module.exports = SAP1DBroadphase;

/**
 * Sweep and prune broadphase along one axis.
 *
 * @class SAP1DBroadphase
 * @constructor
 * @extends Broadphase
 * @param {World} world
 */
function SAP1DBroadphase(world){
    Broadphase.apply(this);

    /**
     * List of bodies currently in the broadphase.
     * @property axisList
     * @type {Array}
     */
    this.axisList = world.bodies.slice(0);

    /**
     * The world to search in.
     * @property world
     * @type {World}
     */
    this.world = world;

    /**
     * Axis to sort the bodies along. Set to 0 for x axis, and 1 for y axis. For best performance, choose an axis that the bodies are spread out more on.
     * @property axisIndex
     * @type {Number}
     */
    this.axisIndex = 0;

    // Add listeners to update the list of bodies.
    var axisList = this.axisList;
    world.on("addBody",function(e){
        axisList.push(e.body);
    }).on("removeBody",function(e){
        var idx = axisList.indexOf(e.body);
        if(idx !== -1)
            axisList.splice(idx,1);
    });
};
SAP1DBroadphase.prototype = new Broadphase();

/**
 * Function for sorting bodies along the X axis. To be passed to array.sort()
 * @method sortAxisListX
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Number}
 */
SAP1DBroadphase.sortAxisListX = function(bodyA,bodyB){
    return (bodyA.position[0]-bodyA.boundingRadius) - (bodyB.position[0]-bodyB.boundingRadius);
};

/**
 * Function for sorting bodies along the Y axis. To be passed to array.sort()
 * @method sortAxisListY
 * @param  {Body} bodyA
 * @param  {Body} bodyB
 * @return {Number}
 */
SAP1DBroadphase.sortAxisListY = function(bodyA,bodyB){
    return (bodyA.position[1]-bodyA.boundingRadius) - (bodyB.position[1]-bodyB.boundingRadius);
};

/**
 * Get the colliding pairs
 * @method getCollisionPairs
 * @param  {World} world
 * @return {Array}
 */
SAP1DBroadphase.prototype.getCollisionPairs = function(world){
    var bodies = this.axisList,
        result = this.result,
        axisIndex = this.axisIndex,
        i,j;

    result.length = 0;

    // Sort the list
    bodies.sort(axisIndex === 0 ? SAP1DBroadphase.sortAxisListX : SAP1DBroadphase.sortAxisListY );

    // Look through the list
    for(i=0, N=bodies.length; i!==N; i++){
        var bi = bodies[i],
            biPos = bi.position[axisIndex],
            ri = bi.boundingRadius;

        for(j=i+1; j<N; j++){
            var bj = bodies[j],
                bjPos = bj.position[axisIndex],
                rj = bj.boundingRadius,
                boundA1 = biPos-ri,
                boundA2 = biPos+ri,
                boundB1 = bjPos-rj,
                boundB2 = bjPos+rj;

            // Abort if we got gap til the next body
            if( boundB1 > boundA2 ){
                break;
            }

            // If we got overlap, add pair
            if(Broadphase.boundingRadiusCheck(bi,bj))
                result.push(bi,bj);
        }
    }

    return result;
};
