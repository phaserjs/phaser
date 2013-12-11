module.exports = Equation;

var vec2 = require('../math/vec2'),
    mat2 = require('../math/mat2'),
    Utils = require('../utils/Utils');

/**
 * Base class for constraint equations.
 * @class Equation
 * @constructor
 * @param {Body} bi First body participating in the equation
 * @param {Body} bj Second body participating in the equation
 * @param {number} minForce Minimum force to apply. Default: -1e6
 * @param {number} maxForce Maximum force to apply. Default: 1e6
 */
function Equation(bi,bj,minForce,maxForce){

    /**
     * Minimum force to apply when solving
     * @property minForce
     * @type {Number}
     */
    this.minForce = typeof(minForce)=="undefined" ? -1e6 : minForce;

    /**
     * Max force to apply when solving
     * @property maxForce
     * @type {Number}
     */
    this.maxForce = typeof(maxForce)=="undefined" ? 1e6 : maxForce;

    /**
     * First body participating in the constraint
     * @property bi
     * @type {Body}
     */
    this.bi = bi;

    /**
     * Second body participating in the constraint
     * @property bj
     * @type {Body}
     */
    this.bj = bj;

    /**
     * The stiffness of this equation. Typically chosen to a large number (~1e7), but can be chosen somewhat freely to get a stable simulation.
     * @property stiffness
     * @type {Number}
     */
    this.stiffness = 1e6;

    /**
     * The number of time steps needed to stabilize the constraint equation. Typically between 3 and 5 time steps.
     * @property relaxation
     * @type {Number}
     */
    this.relaxation = 4;

    /**
     * The Jacobian entry of this equation. 6 numbers, 3 per body (x,y,angle).
     * @property G
     * @type {Array}
     */
    this.G = new Utils.ARRAY_TYPE(6);

    // Constraint frames for body i and j
    /*
    this.xi = vec2.create();
    this.xj = vec2.create();
    this.ai = 0;
    this.aj = 0;
    */
    this.offset = 0;

    this.a = 0;
    this.b = 0;
    this.eps = 0;
    this.h = 0;
    this.updateSpookParams(1/60);

    /**
     * The resulting constraint multiplier from the last solve. This is mostly equivalent to the force produced by the constraint.
     * @property multiplier
     * @type {Number}
     */
    this.multiplier = 0;
};
Equation.prototype.constructor = Equation;

/**
 * Update SPOOK parameters .a, .b and .eps according to the given time step. See equations 9, 10 and 11 in the <a href="http://www8.cs.umu.se/kurser/5DV058/VT09/lectures/spooknotes.pdf">SPOOK notes</a>.
 * @method updateSpookParams
 * @param  {number} timeStep
 */
Equation.prototype.updateSpookParams = function(timeStep){
    var k = this.stiffness,
        d = this.relaxation,
        h = timeStep;
    this.a = 4.0 / (h * (1 + 4 * d));
    this.b = (4.0 * d) / (1 + 4 * d);
    this.eps = 4.0 / (h * h * k * (1 + 4 * d));
    this.h = timeStep;
};

function Gmult(G,vi,wi,vj,wj){
    return  G[0] * vi[0] +
            G[1] * vi[1] +
            G[2] * wi +
            G[3] * vj[0] +
            G[4] * vj[1] +
            G[5] * wj;
}

/**
 * Computes the RHS of the SPOOK equation
 * @method computeB
 * @return {Number}
 */
Equation.prototype.computeB = function(a,b,h){
    var GW = this.computeGW();
    var Gq = this.computeGq();
    var GiMf = this.computeGiMf();
    return - Gq * a - GW * b - GiMf*h;
};

/**
 * Computes G*q, where q are the generalized body coordinates
 * @method computeGq
 * @return {Number}
 */
var qi = vec2.create(),
    qj = vec2.create();
Equation.prototype.computeGq = function(){
    var G = this.G,
        bi = this.bi,
        bj = this.bj,
        xi = bi.position,
        xj = bj.position,
        ai = bi.angle,
        aj = bj.angle;

    // Transform to the given body frames
    /*
    vec2.rotate(qi,this.xi,ai);
    vec2.rotate(qj,this.xj,aj);
    vec2.add(qi,qi,xi);
    vec2.add(qj,qj,xj);
    */

    return Gmult(G, qi, ai, qj, aj) + this.offset;
};

var tmp_i = vec2.create(),
    tmp_j = vec2.create();
Equation.prototype.transformedGmult = function(G,vi,wi,vj,wj){
    // Transform velocity to the given body frames
    // v_p = v + w x r
    /*
    vec2.rotate(tmp_i,this.xi,Math.PI / 2 + this.bi.angle); // Get r, and rotate 90 degrees. We get the "x r" part
    vec2.rotate(tmp_j,this.xj,Math.PI / 2 + this.bj.angle);
    vec2.scale(tmp_i,tmp_i,wi); // Temp vectors are now (w x r)
    vec2.scale(tmp_j,tmp_j,wj);
    vec2.add(tmp_i,tmp_i,vi);
    vec2.add(tmp_j,tmp_j,vj);
    */

    // Note: angular velocity is same
    return Gmult(G,vi,wi,vj,wj);
};

/**
 * Computes G*W, where W are the body velocities
 * @method computeGW
 * @return {Number}
 */
Equation.prototype.computeGW = function(){
    var G = this.G,
        bi = this.bi,
        bj = this.bj,
        vi = bi.velocity,
        vj = bj.velocity,
        wi = bi.angularVelocity,
        wj = bj.angularVelocity;
    return this.transformedGmult(G,vi,wi,vj,wj);
};

/**
 * Computes G*Wlambda, where W are the body velocities
 * @method computeGWlambda
 * @return {Number}
 */
Equation.prototype.computeGWlambda = function(){
    var G = this.G,
        bi = this.bi,
        bj = this.bj,
        vi = bi.vlambda,
        vj = bj.vlambda,
        wi = bi.wlambda,
        wj = bj.wlambda;
    return this.transformedGmult(G,vi,wi,vj,wj);
};

/**
 * Computes G*inv(M)*f, where M is the mass matrix with diagonal blocks for each body, and f are the forces on the bodies.
 * @method computeGiMf
 * @return {Number}
 */
var iMfi = vec2.create(),
    iMfj = vec2.create();
Equation.prototype.computeGiMf = function(){
    var bi = this.bi,
        bj = this.bj,
        fi = bi.force,
        ti = bi.angularForce,
        fj = bj.force,
        tj = bj.angularForce,
        invMassi = bi.invMass,
        invMassj = bj.invMass,
        invIi = bi.invInertia,
        invIj = bj.invInertia,
        G = this.G;

    vec2.scale(iMfi, fi,invMassi);
    vec2.scale(iMfj, fj,invMassj);

    return this.transformedGmult(G,iMfi,ti*invIi,iMfj,tj*invIj);
};

/**
 * Computes G*inv(M)*G'
 * @method computeGiMGt
 * @return {Number}
 */
Equation.prototype.computeGiMGt = function(){
    var bi = this.bi,
        bj = this.bj,
        invMassi = bi.invMass,
        invMassj = bj.invMass,
        invIi = bi.invInertia,
        invIj = bj.invInertia,
        G = this.G;

    return  G[0] * G[0] * invMassi +
            G[1] * G[1] * invMassi +
            G[2] * G[2] *    invIi +
            G[3] * G[3] * invMassj +
            G[4] * G[4] * invMassj +
            G[5] * G[5] *    invIj;
};

var addToWlambda_temp = vec2.create(),
    addToWlambda_Gi = vec2.create(),
    addToWlambda_Gj = vec2.create(),
    addToWlambda_ri = vec2.create(),
    addToWlambda_rj = vec2.create();
var tmpMat1 = mat2.create(),
    tmpMat2 = mat2.create();

/**
 * Add constraint velocity to the bodies.
 * @method addToWlambda
 * @param {Number} deltalambda
 */
Equation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bi,
        bj = this.bj,
        temp = addToWlambda_temp,
        imMat1 = tmpMat1,
        imMat2 = tmpMat2,
        Gi = addToWlambda_Gi,
        Gj = addToWlambda_Gj,
        ri = addToWlambda_ri,
        rj = addToWlambda_rj,
        G = this.G;

    Gi[0] = G[0];
    Gi[1] = G[1];
    Gj[0] = G[3];
    Gj[1] = G[4];

    mat2.identity(imMat1);
    mat2.identity(imMat2);
    imMat1[0] = imMat1[3] = bi.invMass;
    imMat2[0] = imMat2[3] = bj.invMass;

    /*
    vec2.rotate(ri,this.xi,bi.angle);
    vec2.rotate(rj,this.xj,bj.angle);
    */

    // Add to linear velocity
    vec2.scale(temp,vec2.transformMat2(temp,Gi,imMat1),deltalambda);
    vec2.add( bi.vlambda, bi.vlambda, temp);
    // This impulse is in the offset frame
    // Also add contribution to angular
    //bi.wlambda -= vec2.crossLength(temp,ri);

    vec2.scale(temp,vec2.transformMat2(temp,Gj,imMat2),deltalambda);
    vec2.add( bj.vlambda, bj.vlambda, temp);
    //bj.wlambda -= vec2.crossLength(temp,rj);

    // Add to angular velocity
    bi.wlambda += bi.invInertia * G[2] * deltalambda;
    bj.wlambda += bj.invInertia * G[5] * deltalambda;
};

/**
 * Compute the denominator part of the SPOOK equation: C = G*inv(M)*G' + eps
 * @method computeC
 * @param  {Number} eps
 * @return {Number}
 */
Equation.prototype.computeC = function(eps){
    return this.computeGiMGt() + eps;
};
