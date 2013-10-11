module.exports = Shape;

/**
 * Base class for shapes.
 * @class Shape
 * @constructor
 */
function Shape(type){
    this.type = type;

    /**
     * Bounding circle radius of this shape
     * @property boundingRadius
     * @type {Number}
     */
    this.boundingRadius = 0;

    /**
     * Collision group that this shape belongs to (bit mask). See <a href="http://www.aurelienribon.com/blog/2011/07/box2d-tutorial-collision-filtering/">this tutorial</a>.
     * @property collisionGroup
     * @type {Number}
     * @example
     *     // Setup bits for each available group
     *     var PLAYER = Math.pow(2,0),
     *         ENEMY =  Math.pow(2,1),
     *         GROUND = Math.pow(2,2)
     *
     *     // Put shapes into their groups
     *     player1Shape.collisionGroup = PLAYER;
     *     player2Shape.collisionGroup = PLAYER;
     *     enemyShape  .collisionGroup = ENEMY;
     *     groundShape .collisionGroup = GROUND;
     *
     *     // Assign groups that each shape collide with.
     *     // Note that the players can collide with ground and enemies, but not with other players.
     *     player1Shape.collisionMask = ENEMY | GROUND;
     *     player2Shape.collisionMask = ENEMY | GROUND;
     *     enemyShape  .collisionMask = PLAYER | GROUND;
     *     groundShape .collisionMask = PLAYER | ENEMY;
     *
     * @example
     *     // How collision check is done
     *     if(shapeA.collisionGroup & shapeB.collisionMask)!=0 && (shapeB.collisionGroup & shapeA.collisionMask)!=0){
     *         // The shapes will collide
     *     }
     */
    this.collisionGroup = 1;

    /**
     * Collision mask of this shape. See .collisionGroup.
     * @property collisionMask
     * @type {Number}
     */
    this.collisionMask =  1;
    if(type) this.updateBoundingRadius();

    /**
     * Material to use in collisions for this Shape. If this is set to null, the world will use default material properties instead.
     * @property material
     * @type {Material}
     */
    this.material = null;
};

Shape.CIRCLE =      1;
Shape.PARTICLE =    2;
Shape.PLANE =       4;
Shape.CONVEX =      8;
Shape.LINE =        16;
Shape.RECTANGLE =   32;
Shape.CAPSULE =     64;

/**
 * Should return the moment of inertia around the Z axis of the body given the total mass. See <a href="http://en.wikipedia.org/wiki/List_of_moments_of_inertia">Wikipedia's list of moments of inertia</a>.
 * @method computeMomentOfInertia
 * @param  {Number} mass
 * @return {Number} If the inertia is infinity or if the object simply isn't possible to rotate, return 0.
 */
Shape.prototype.computeMomentOfInertia = function(mass){
    throw new Error("Shape.computeMomentOfInertia is not implemented in this Shape...");
};

/**
 * Returns the bounding circle radius of this shape.
 * @method updateBoundingRadius
 * @return {Number}
 */
Shape.prototype.updateBoundingRadius = function(){
    throw new Error("Shape.updateBoundingRadius is not implemented in this Shape...");
};
