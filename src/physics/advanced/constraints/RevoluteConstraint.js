var Constraint = require('./Constraint')
,   Equation = require('./Equation')
,   RotationalVelocityEquation = require('./RotationalVelocityEquation')
,   RotationalLockEquation = require('./RotationalLockEquation')
,   vec2 = require('../math/vec2')

module.exports = RevoluteConstraint;

var worldPivotA = vec2.create(),
    worldPivotB = vec2.create(),
    xAxis = vec2.fromValues(1,0),
    yAxis = vec2.fromValues(0,1),
    g = vec2.create();

/**
 * Connects two bodies at given offset points, letting them rotate relative to each other around this point.
 * @class RevoluteConstraint
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
function RevoluteConstraint(bodyA, pivotA, bodyB, pivotB, maxForce){
    Constraint.call(this,bodyA,bodyB);

    maxForce = typeof(maxForce)!="undefined" ? maxForce : Number.MAX_VALUE;

    this.pivotA = pivotA;
    this.pivotB = pivotB;

    // Equations to be fed to the solver
    var eqs = this.equations = [
        new Equation(bodyA,bodyB,-maxForce,maxForce),
        new Equation(bodyA,bodyB,-maxForce,maxForce),
    ];

    var x =  eqs[0];
    var y = eqs[1];

    x.computeGq = function(){
        vec2.rotate(worldPivotA, pivotA, bodyA.angle);
        vec2.rotate(worldPivotB, pivotB, bodyB.angle);
        vec2.add(g, bodyB.position, worldPivotB);
        vec2.sub(g, g, bodyA.position);
        vec2.sub(g, g, worldPivotA);
        return vec2.dot(g,xAxis);
    };

    y.computeGq = function(){
        vec2.rotate(worldPivotA, pivotA, bodyA.angle);
        vec2.rotate(worldPivotB, pivotB, bodyB.angle);
        vec2.add(g, bodyB.position, worldPivotB);
        vec2.sub(g, g, bodyA.position);
        vec2.sub(g, g, worldPivotA);
        return vec2.dot(g,yAxis);
    };

    y.minForce = x.minForce = -maxForce;
    y.maxForce = x.maxForce =  maxForce;

    this.motorEquation = new RotationalVelocityEquation(bodyA,bodyB);
    this.motorEnabled = false;

    // Angle limits
    this.lowerLimitEnabled = false;
    this.upperLimitEnabled = false;
    this.lowerLimit = 0;
    this.upperLimit = 0;
    this.upperLimitEquation = new RotationalLockEquation(bodyA,bodyB);
    this.lowerLimitEquation = new RotationalLockEquation(bodyA,bodyB);
    this.upperLimitEquation.minForce = 0;
    this.lowerLimitEquation.maxForce = 0;
}
RevoluteConstraint.prototype = new Constraint();

RevoluteConstraint.prototype.update = function(){
    var bodyA =  this.bodyA,
        bodyB =  this.bodyB,
        pivotA = this.pivotA,
        pivotB = this.pivotB,
        eqs =    this.equations,
        normal = eqs[0],
        tangent= eqs[1],
        x = eqs[0],
        y = eqs[1],
        upperLimit = this.upperLimit,
        lowerLimit = this.lowerLimit,
        upperLimitEquation = this.upperLimitEquation,
        lowerLimitEquation = this.lowerLimitEquation;

    var relAngle = this.angle = bodyB.angle - bodyA.angle;

    if(this.upperLimitEnabled && relAngle > upperLimit){
        upperLimitEquation.angle = upperLimit;
        if(eqs.indexOf(upperLimitEquation)==-1)
            eqs.push(upperLimitEquation);
    } else {
        var idx = eqs.indexOf(upperLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }

    if(this.lowerLimitEnabled && relAngle < lowerLimit){
        lowerLimitEquation.angle = lowerLimit;
        if(eqs.indexOf(lowerLimitEquation)==-1)
            eqs.push(lowerLimitEquation);
    } else {
        var idx = eqs.indexOf(lowerLimitEquation);
        if(idx != -1) eqs.splice(idx,1);
    }

    /*

    The constraint violation is

        g = xj + rj - xi - ri

    ...where xi and xj are the body positions and ri and rj world-oriented offset vectors. Differentiate:

        gdot = vj + wj x rj - vi - wi x ri

    We split this into x and y directions. (let x and y be unit vectors along the respective axes)

        gdot * x = ( vj + wj x rj - vi - wi x ri ) * x
                 = ( vj*x + (wj x rj)*x -vi*x -(wi x ri)*x
                 = ( vj*x + (rj x x)*wj -vi*x -(ri x x)*wi
                 = [ -x   -(ri x x)   x   (rj x x)] * [vi wi vj wj]
                 = G*W

    ...and similar for y. We have then identified the jacobian entries for x and y directions:

        Gx = [ x   (rj x x)   -x   -(ri x x)]
        Gy = [ y   (rj x y)   -y   -(ri x y)]

     */

    vec2.rotate(worldPivotA, pivotA, bodyA.angle);
    vec2.rotate(worldPivotB, pivotB, bodyB.angle);

    x.G[0] = -1;
    x.G[1] =  0;
    x.G[2] = -vec2.crossLength(worldPivotA,xAxis);
    x.G[3] =  1;
    x.G[4] =  0;
    x.G[5] =  vec2.crossLength(worldPivotB,xAxis);

    y.G[0] =  0;
    y.G[1] = -1;
    y.G[2] = -vec2.crossLength(worldPivotA,yAxis);
    y.G[3] =  0;
    y.G[4] =  1;
    y.G[5] =  vec2.crossLength(worldPivotB,yAxis);
};

/**
 * Enable the rotational motor
 * @method enableMotor
 */
RevoluteConstraint.prototype.enableMotor = function(){
    if(this.motorEnabled) return;
    this.equations.push(this.motorEquation);
    this.motorEnabled = true;
};

/**
 * Disable the rotational motor
 * @method disableMotor
 */
RevoluteConstraint.prototype.disableMotor = function(){
    if(!this.motorEnabled) return;
    var i = this.equations.indexOf(this.motorEquation);
    this.equations.splice(i,1);
    this.motorEnabled = false;
};

/**
 * Check if the motor is enabled.
 * @method motorIsEnabled
 * @return {Boolean}
 */
RevoluteConstraint.prototype.motorIsEnabled = function(){
    return !!this.motorEnabled;
};

/**
 * Set the speed of the rotational constraint motor
 * @method setMotorSpeed
 * @param  {Number} speed
 */
RevoluteConstraint.prototype.setMotorSpeed = function(speed){
    if(!this.motorEnabled) return;
    var i = this.equations.indexOf(this.motorEquation);
    this.equations[i].relativeVelocity = speed;
};

/**
 * Get the speed of the rotational constraint motor
 * @method getMotorSpeed
 * @return  {Number} The current speed, or false if the motor is not enabled.
 */
RevoluteConstraint.prototype.getMotorSpeed = function(){
    if(!this.motorEnabled) return false;
    return this.motorEquation.relativeVelocity;
};
