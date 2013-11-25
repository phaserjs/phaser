module.exports = Constraint;

/**
 * Base constraint class.
 *
 * @class Constraint
 * @constructor
 * @author schteppe
 * @param {Body} bodyA
 * @param {Body} bodyB
 */
function Constraint(bodyA,bodyB){

    /**
    * Equations to be solved in this constraint
    * @property equations
    * @type {Array}
    */
    this.equations = [];

    /**
    * First body participating in the constraint.
    * @property bodyA
    * @type {Body}
    */
    this.bodyA = bodyA;

    /**
    * Second body participating in the constraint.
    * @property bodyB
    * @type {Body}
    */
    this.bodyB = bodyB;
};

/**
 * To be implemented by subclasses. Should update the internal constraint parameters.
 * @method update
 */
/*Constraint.prototype.update = function(){
    throw new Error("method update() not implmemented in this Constraint subclass!");
};*/
