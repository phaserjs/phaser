var mat2 = require('../math/mat2')
,   vec2 = require('../math/vec2')
,   Equation = require('./Equation')
,   Utils = require('../utils/Utils')

module.exports = FrictionEquation;

/**
 * Constrains the slipping in a contact along a tangent
 *
 * @class FrictionEquation
 * @constructor
 * @param {Body} bi
 * @param {Body} bj
 * @param {Number} slipForce
 * @extends {Equation}
 */
function FrictionEquation(bi,bj,slipForce){
    Equation.call(this,bi,bj,-slipForce,slipForce);

    /**
     * Relative vector from center of body i to the contact point, in world coords.
     * @property ri
     * @type {Float32Array}
     */
    this.ri = vec2.create();

    /**
     * Relative vector from center of body j to the contact point, in world coords.
     * @property rj
     * @type {Float32Array}
     */
    this.rj = vec2.create();

    /**
     * Tangent vector that the friction force will act along, in world coords.
     * @property t
     * @type {Float32Array}
     */
    this.t = vec2.create();

    /**
     * A ContactEquation connected to this friction. The contact equation can be used to rescale the max force for the friction.
     * @property contactEquation
     * @type {ContactEquation}
     */
    this.contactEquation = null;

    /**
     * The shape in body i that triggered this friction.
     * @property shapeA
     * @type {Shape}
     */
    this.shapeA = null;

    /**
     * The shape in body j that triggered this friction.
     * @property shapeB
     * @type {Shape}
     */
    this.shapeB = null;

    /**
     * The friction coefficient to use.
     * @property frictionCoefficient
     * @type {Number}
     */
    this.frictionCoefficient = 0.3;
};
FrictionEquation.prototype = new Equation();
FrictionEquation.prototype.constructor = FrictionEquation;

/**
 * Set the slipping condition for the constraint. The friction force cannot be
 * larger than this value.
 * @method setSlipForce
 * @param  {Number} slipForce
 * @deprecated Use .frictionCoefficient instead
 */
FrictionEquation.prototype.setSlipForce = function(slipForce){
    this.maxForce = slipForce;
    this.minForce = -slipForce;
};

FrictionEquation.prototype.computeB = function(a,b,h){
    var bi = this.bi,
        bj = this.bj,
        ri = this.ri,
        rj = this.rj,
        t = this.t,
        G = this.G;

    // G = [-t -rixt t rjxt]
    // And remember, this is a pure velocity constraint, g is always zero!
    G[0] = -t[0];
    G[1] = -t[1];
    G[2] = -vec2.crossLength(ri,t);
    G[3] = t[0];
    G[4] = t[1];
    G[5] = vec2.crossLength(rj,t);

    var GW = this.computeGW();
    var GiMf = this.computeGiMf();

    var B = /* - g * a  */ - GW * b - h*GiMf;

    return B;
};
