/**
* The `Matter.Pair` module contains methods for creating and manipulating collision pairs.
*
* @class Pair
*/

var Pair = {};

module.exports = Pair;

(function() {
    
    /**
     * Creates a pair.
     * @method create
     * @param {collision} collision
     * @param {number} timestamp
     * @return {pair} A new pair
     */
    Pair.create = function(collision, timestamp) {
        var bodyA = collision.bodyA,
            bodyB = collision.bodyB;

        var pair = {
            id: Pair.id(bodyA, bodyB),
            bodyA: bodyA,
            bodyB: bodyB,
            activeContacts: [],
            separation: 0,
            isActive: true,
            confirmedActive: true,
            isSensor: bodyA.isSensor || bodyB.isSensor,
            timeCreated: timestamp,
            timeUpdated: timestamp,

            collision: null,
            inverseMass: 0,
            friction: 0,
            frictionStatic: 0,
            restitution: 0,
            slop: 0
        };

        Pair.update(pair, collision, timestamp);

        return pair;
    };

    /**
     * Updates a pair given a collision.
     * @method update
     * @param {pair} pair
     * @param {collision} collision
     * @param {number} timestamp
     */
    Pair.update = function(pair, collision, timestamp) {
        // var contacts = pair.contacts,
        //     supports = collision.supports,
        //     activeContacts = pair.activeContacts,
        //     parentA = collision.parentA,
        //     parentB = collision.parentB;
        
        pair.collision = collision;
        // pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
        // pair.friction = Math.min(parentA.friction, parentB.friction);
        // pair.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
        // pair.restitution = Math.max(parentA.restitution, parentB.restitution);
        // pair.slop = Math.max(parentA.slop, parentB.slop);
        // activeContacts.length = 0;
        
        if (collision.collided) {

            var supports = collision.supports,
                activeContacts = pair.activeContacts,
                parentA = collision.parentA,
                parentB = collision.parentB;

            pair.inverseMass = parentA.inverseMass + parentB.inverseMass;
            pair.friction = Math.min(parentA.friction, parentB.friction);
            pair.frictionStatic = Math.max(parentA.frictionStatic, parentB.frictionStatic);
            pair.restitution = Math.max(parentA.restitution, parentB.restitution);
            pair.slop = Math.max(parentA.slop, parentB.slop);

            for (var i = 0; i < supports.length; i++) {
                activeContacts[i] = supports[i].contact;
            }

            var supportCount = supports.length;

            if (supportCount < activeContacts.length) {
                activeContacts.length = supportCount;
            }

            pair.separation = collision.depth;
            Pair.setActive(pair, true, timestamp);
        } else {
            if (pair.isActive === true)
                Pair.setActive(pair, false, timestamp);
        }
    };
    
    /**
     * Set a pair as active or inactive.
     * @method setActive
     * @param {pair} pair
     * @param {bool} isActive
     * @param {number} timestamp
     */
    Pair.setActive = function(pair, isActive, timestamp) {
        if (isActive) {
            pair.isActive = true;
            pair.timeUpdated = timestamp;
        } else {
            pair.isActive = false;
            pair.activeContacts.length = 0;
        }
    };

    /**
     * Get the id for the given pair.
     * @method id
     * @param {body} bodyA
     * @param {body} bodyB
     * @return {string} Unique pairId
     */
    Pair.id = function(bodyA, bodyB) {
        if (bodyA.id < bodyB.id) {
            return 'A' + bodyA.id + 'B' + bodyB.id;
        } else {
            return 'A' + bodyB.id + 'B' + bodyA.id;
        }
    };

})();
