var Constraint = require('./Constraint')
,   ContactEquation = require('./ContactEquation')
,   RotationalVelocityEquation = require('./RotationalVelocityEquation')
,   vec2 = require('../math/vec2')

module.exports = PointToPointConstraint;

/**
 * Connects two bodies at given offset points
 * @class PointToPointConstraint
 * @constructor
 * @author schteppe
 * @param {Body}            bodyA
 * @param {Float32Array}    pivotA The point relative to the center of mass of bodyA which bodyA is constrained to.
 * @param {Body}            bodyB Body that will be constrained in a similar way to the same point as bodyA. We will therefore get sort of a link between bodyA and bodyB. If not specified, bodyA will be constrained to a static point.
 * @param {Float32Array}    pivotB See pivotA.
 * @param {Number}          maxForce The maximum force that should be applied to constrain the bodies.
 * @extends {Constraint}
 * @todo Ability to specify world points
 */
function PointToPointConstraint(bodyA, pivotA, bodyB, pivotB, maxForce){
    Constraint.call(this,bodyA,bodyB);

    maxForce = typeof(maxForce)!="undefined" ? maxForce : 1e7;

    this.pivotA = pivotA;
    this.pivotB = pivotB;

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new ContactEquation(bodyA,bodyB), // Normal
        new ContactEquation(bodyA,bodyB), // Tangent
    ];

    var normal =  eqs[0];
    var tangent = eqs[1];

    tangent.minForce = normal.minForce = -maxForce;
    tangent.maxForce = normal.maxForce =  maxForce;

    this.motorEquation = null;
}
PointToPointConstraint.prototype = new Constraint();

PointToPointConstraint.prototype.update = function(){
    var bodyA =  this.bodyA,
        bodyB =  this.bodyB,
        pivotA = this.pivotA,
        pivotB = this.pivotB,
        eqs =    this.equations,
        normal = eqs[0],
        tangent= eqs[1];

    vec2.subtract(normal.ni, bodyB.position, bodyA.position);
    vec2.normalize(normal.ni,normal.ni);
    vec2.rotate(normal.ri, pivotA, bodyA.angle);
    vec2.rotate(normal.rj, pivotB, bodyB.angle);

    vec2.rotate(tangent.ni, normal.ni, Math.PI / 2);
    vec2.copy(tangent.ri, normal.ri);
    vec2.copy(tangent.rj, normal.rj);
};

/**
 * Enable the rotational motor
 * @method enableMotor
 */
PointToPointConstraint.prototype.enableMotor = function(){
    if(this.motorEquation) return;
    this.motorEquation = new RotationalVelocityEquation(this.bodyA,this.bodyB);
    this.equations.push(this.motorEquation);
};

/**
 * Disable the rotational motor
 * @method disableMotor
 */
PointToPointConstraint.prototype.disableMotor = function(){
    if(!this.motorEquation) return;
    var i = this.equations.indexOf(this.motorEquation);
    this.motorEquation = null;
    this.equations.splice(i,1);
};

/**
 * Set the speed of the rotational constraint motor
 * @method setMotorSpeed
 * @param  {Number} speed
 */
PointToPointConstraint.prototype.setMotorSpeed = function(speed){
    if(!this.motorEquation) return;
    var i = this.equations.indexOf(this.motorEquation);
    this.equations[i].relativeVelocity = speed;
};
