var Constraint = require('./Constraint')
,   ContactEquation = require('./ContactEquation')
,   Equation = require('./Equation')
,   vec2 = require('../math/vec2')
,   RotationalLockEquation = require('./RotationalLockEquation')

module.exports = PrismaticConstraint;

/**
 * Constraint that only allows bodies to move along a line, relative to each other. See <a href="http://www.iforce2d.net/b2dtut/joints-prismatic">this tutorial</a>.
 *
 * @class PrismaticConstraint
 * @constructor
 * @extends {Constraint}
 * @author schteppe
 * @param {Body}    bodyA
 * @param {Body}    bodyB
 * @param {Object}  options
 * @param {Number}  options.maxForce        Max force to be applied by the constraint
 * @param {Array}   options.localAnchorA    Body A's anchor point, defined in its own local frame.
 * @param {Array}   options.localAnchorB    Body B's anchor point, defined in its own local frame.
 * @param {Array}   options.localAxisA      An axis, defined in body A frame, that body B's anchor point may slide along.
 */
function PrismaticConstraint(bodyA,bodyB,options){
    options = options || {};
    Constraint.call(this,bodyA,bodyB);

    // Get anchors
    var localAnchorA = vec2.fromValues(0,0),
        localAxisA = vec2.fromValues(1,0),
        localAnchorB = vec2.fromValues(0,0);
    if(options.localAnchorA) vec2.copy(localAnchorA, options.localAnchorA);
    if(options.localAxisA)   vec2.copy(localAxisA,   options.localAxisA);
    if(options.localAnchorB) vec2.copy(localAnchorB, options.localAnchorB);

    /**
     * @property localAnchorA
     * @type {Array}
     */
    this.localAnchorA = localAnchorA;

    /**
     * @property localAnchorB
     * @type {Array}
     */
    this.localAnchorB = localAnchorB;

    /**
     * @property localAxisA
     * @type {Array}
     */
    this.localAxisA = localAxisA;

    /*

    The constraint violation for the common axis point is

        g = ( xj + rj - xi - ri ) * t   :=  gg*t

    where r are body-local anchor points, and t is a tangent to the constraint axis defined in body i frame.

        gdot =  ( vj + wj x rj - vi - wi x ri ) * t + ( xj + rj - xi - ri ) * ( wi x t )

    Note the use of the chain rule. Now we identify the jacobian

        G*W = [ -t      -ri x t + t x gg     t    rj x t ] * [vi wi vj wj]

    The rotational part is just a rotation lock.

     */

    var maxForce = this.maxForce = typeof(options.maxForce)==="undefined" ? options.maxForce : Number.MAX_VALUE;

    // Translational part
    var trans = new Equation(bodyA,bodyB,-maxForce,maxForce);
    var ri = new vec2.create(),
        rj = new vec2.create(),
        gg = new vec2.create(),
        t =  new vec2.create();
    trans.computeGq = function(){
        // g = ( xj + rj - xi - ri ) * t
        return vec2.dot(gg,t);
    };
    trans.update = function(){
        var G = this.G,
            xi = bodyA.position,
            xj = bodyB.position;
        vec2.rotate(ri,localAnchorA,bodyA.angle);
        vec2.rotate(rj,localAnchorB,bodyB.angle);
        vec2.add(gg,xj,rj);
        vec2.sub(gg,gg,xi);
        vec2.sub(gg,gg,ri);
        vec2.rotate(t,localAxisA,bodyA.angle+Math.PI/2);

        G[0] = -t[0];
        G[1] = -t[1];
        G[2] = -vec2.crossLength(ri,t) + vec2.crossLength(t,gg);
        G[3] = t[0];
        G[4] = t[1];
        G[5] = vec2.crossLength(rj,t);
    }
    var rot = new RotationalLockEquation(bodyA,bodyB,-maxForce,maxForce);

    this.equations.push(trans,rot);
}

PrismaticConstraint.prototype = new Constraint();

/**
 * Update the constraint equations. Should be done if any of the bodies changed position, before solving.
 * @method update
 */
PrismaticConstraint.prototype.update = function(){
    var eqs = this.equations,
        trans = eqs[0];
    trans.update();
};
