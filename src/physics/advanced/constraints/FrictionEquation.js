var mat2 = require('../math/mat2')
,   vec2 = require('../math/vec2')
,   Equation = require('./Equation')

module.exports = FrictionEquation;

// 3D cross product from glmatrix, until we get this to work...
function cross(out, a, b) {
    var ax = a[0], ay = a[1], az = a[2],
        bx = b[0], by = b[1], bz = b[2];

    out[0] = ay * bz - az * by;
    out[1] = az * bx - ax * bz;
    out[2] = ax * by - ay * bx;
    return out;
};

var dot = vec2.dot;

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

    this.rixt = 0;
    this.rjxt = 0;
};
FrictionEquation.prototype = new Equation();
FrictionEquation.prototype.constructor = FrictionEquation;

/**
 * Set the slipping condition for the constraint. The friction force cannot be
 * larger than this value.
 * @method setSlipForce
 * @param  {Number} slipForce
 */
FrictionEquation.prototype.setSlipForce = function(slipForce){
    this.maxForce = slipForce;
    this.minForce = -slipForce;
};

var rixtVec = [0,0,0];
var rjxtVec = [0,0,0];
var ri3 = [0,0,0];
var rj3 = [0,0,0];
var t3 = [0,0,0];
FrictionEquation.prototype.computeB = function(a,b,h){
    var a = this.a,
        b = this.b,
        bi = this.bi,
        bj = this.bj,
        ri = this.ri,
        rj = this.rj,
        t = this.t;

    // Caluclate cross products
    ri3[0] = ri[0];
    ri3[1] = ri[1];
    rj3[0] = rj[0];
    rj3[1] = rj[1];
    t3[0] = t[0];
    t3[1] = t[1];
    cross(rixtVec, ri3, t3);//ri.cross(t,rixt);
    cross(rjxtVec, rj3, t3);//rj.cross(t,rjxt);
    this.rixt = rixtVec[2];
    this.rjxt = rjxtVec[2];

    var GW = -dot(bi.velocity,t) + dot(bj.velocity,t) - this.rixt*bi.angularVelocity + this.rjxt*bj.angularVelocity; // eq. 40
    var GiMf = -dot(bi.force,t)*bi.invMass +dot(bj.force,t)*bj.invMass -this.rixt*bi.invInertia*bi.angularForce + this.rjxt*bj.invInertia*bj.angularForce;

    var B = /* - Gq * a  */ - GW * b - h*GiMf;

    return B;
};

// Compute C = G * iM * G' + eps
//
// G*iM*G' =
//
//                             [ iM1          ] [-t     ]
// [-t (-ri x t) t (rj x t)] * [    iI1       ] [-ri x t]
//                             [       iM2    ] [t      ]
//                             [          iI2 ] [rj x t ]
//
// = (-t)*iM1*(-t) + (-ri x t)*iI1*(-ri x t) + t*iM2*t + (rj x t)*iI2*(rj x t)
//
// = t*iM1*t + (ri x t)*iI1*(ri x t) + t*iM2*t + (rj x t)*iI2*(rj x t)
//
var computeC_tmp1 = vec2.create(),
    tmpMat1 = mat2.create(),
    tmpMat2 = mat2.create();
FrictionEquation.prototype.computeC = function(eps){
    var bi = this.bi,
        bj = this.bj,
        t = this.t,
        C = 0.0,
        tmp = computeC_tmp1,
        imMat1 = tmpMat1,
        imMat2 = tmpMat2,
        dot = vec2.dot;

    mat2.identity(imMat1);
    mat2.identity(imMat2);

    imMat1[0] = imMat1[3] = bi.invMass;
    imMat2[0] = imMat2[3] = bj.invMass;

    C = dot(t,vec2.transformMat2(tmp,t,imMat1)) + dot(t,vec2.transformMat2(tmp,t,imMat2)) + eps;

    //C = bi.invMass + bj.invMass + eps;

    C += bi.invInertia * this.rixt * this.rixt;
    C += bj.invInertia * this.rjxt * this.rjxt;

    return C;
};

FrictionEquation.prototype.computeGWlambda = function(){
    var bi = this.bi,
        bj = this.bj,
        t = this.t,
        dot = vec2.dot;

    return dot(t, bj.vlambda) + bj.wlambda * this.rjxt - bi.wlambda * this.rixt - dot(t, bi.vlambda);
};

var FrictionEquation_addToWlambda_tmp = vec2.create();
FrictionEquation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bi,
        bj = this.bj,
        t = this.t,
        tmp = FrictionEquation_addToWlambda_tmp,
        imMat1 = tmpMat1,
        imMat2 = tmpMat2;

    mat2.identity(imMat1);
    mat2.identity(imMat2);
    imMat1[0] = imMat1[3] = bi.invMass;
    imMat2[0] = imMat2[3] = bj.invMass;

    vec2.scale(tmp,vec2.transformMat2(tmp,t,imMat1),-deltalambda);
    //vec2.scale(tmp, t, -bi.invMass * deltalambda);  //t.mult(invMassi * deltalambda, tmp);
    vec2.add(bi.vlambda, bi.vlambda, tmp);          //bi.vlambda.vsub(tmp,bi.vlambda);

    vec2.scale(tmp,vec2.transformMat2(tmp,t,imMat2),deltalambda);
    //vec2.scale(tmp, t, bj.invMass * deltalambda);   //t.mult(invMassj * deltalambda, tmp);
    vec2.add(bj.vlambda, bj.vlambda, tmp);          //bj.vlambda.vadd(tmp,bj.vlambda);

    bi.wlambda -= bi.invInertia * this.rixt * deltalambda;
    bj.wlambda += bj.invInertia * this.rjxt * deltalambda;
};
