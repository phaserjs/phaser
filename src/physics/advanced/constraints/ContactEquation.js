var Equation = require("./Equation"),
    vec2 = require('../math/vec2'),
    mat2 = require('../math/mat2');

module.exports = ContactEquation;

/**
 * Non-penetration constraint equation.
 *
 * @class ContactEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 */
function ContactEquation(bi,bj){
    Equation.call(this,bi,bj,0,1e6);
    this.ri = vec2.create();
    this.penetrationVec = vec2.create();
    this.rj = vec2.create();
    this.ni = vec2.create();
    this.rixn = 0;
    this.rjxn = 0;
};
ContactEquation.prototype = new Equation();
ContactEquation.prototype.constructor = ContactEquation;
ContactEquation.prototype.computeB = function(a,b,h){
    var bi = this.bi,
        bj = this.bj,
        ri = this.ri,
        rj = this.rj,
        xi = bi.position,
        xj = bj.position;

    var vi = bi.velocity,
        wi = bi.angularVelocity,
        fi = bi.force,
        taui = bi.angularForce;

    var vj = bj.velocity,
        wj = bj.angularVelocity,
        fj = bj.force,
        tauj = bj.angularForce;

    var penetrationVec = this.penetrationVec,
        invMassi = bi.invMass,
        invMassj = bj.invMass,
        invIi = bi.invInertia,
        invIj = bj.invInertia,
        n = this.ni;

    // Caluclate cross products
    this.rixn = vec2.crossLength(ri,n);
    this.rjxn = vec2.crossLength(rj,n);

    // Calculate q = xj+rj -(xi+ri) i.e. the penetration vector
    vec2.add(penetrationVec,xj,rj);
    vec2.sub(penetrationVec,penetrationVec,xi);
    vec2.sub(penetrationVec,penetrationVec,ri);

    var Gq = vec2.dot(n,penetrationVec);

    // Compute iteration
    var GW = vec2.dot(vj,n) - vec2.dot(vi,n) + wj * this.rjxn - wi * this.rixn;
    var GiMf = vec2.dot(fj,n)*invMassj - vec2.dot(fi,n)*invMassi + invIj*tauj*this.rjxn - invIi*taui*this.rixn;

    var B = - Gq * a - GW * b - h*GiMf;

    return B;
};

// Compute C = GMG+eps in the SPOOK equation
var computeC_tmp1 = vec2.create(),
    tmpMat1 = mat2.create(),
    tmpMat2 = mat2.create();
ContactEquation.prototype.computeC = function(eps){
    var bi = this.bi,
        bj = this.bj,
        n = this.ni,
        rixn = this.rixn,
        rjxn = this.rjxn,
        tmp = computeC_tmp1,
        imMat1 = tmpMat1,
        imMat2 = tmpMat2;

    mat2.identity(imMat1);
    mat2.identity(imMat2);
    imMat1[0] = imMat1[3] = bi.invMass;
    imMat2[0] = imMat2[3] = bj.invMass;

    var C = vec2.dot(n,vec2.transformMat2(tmp,n,imMat1)) + vec2.dot(n,vec2.transformMat2(tmp,n,imMat2)) + eps;
    //var C = bi.invMass + bj.invMass + eps;

    C += bi.invInertia * this.rixn * this.rixn;
    C += bj.invInertia * this.rjxn * this.rjxn;

    return C;
};

ContactEquation.prototype.computeGWlambda = function(){
    var bi = this.bi,
        bj = this.bj,
        n = this.ni,
        dot = vec2.dot;

    return dot(n, bj.vlambda) + bj.wlambda * this.rjxn - dot(n, bi.vlambda) - bi.wlambda * this.rixn;
};

var addToWlambda_temp = vec2.create();
ContactEquation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bi,
        bj = this.bj,
        n = this.ni,
        temp = addToWlambda_temp,
        imMat1 = tmpMat1,
        imMat2 = tmpMat2;

    mat2.identity(imMat1);
    mat2.identity(imMat2);
    imMat1[0] = imMat1[3] = bi.invMass;
    imMat2[0] = imMat2[3] = bj.invMass;

    // Add to linear velocity
    //vec2.scale(temp,n,-bi.invMass*deltalambda);
    vec2.scale(temp,vec2.transformMat2(temp,n,imMat1),-deltalambda);
    vec2.add( bi.vlambda,bi.vlambda, temp );

    //vec2.scale(temp,n,bj.invMass*deltalambda);
    vec2.scale(temp,vec2.transformMat2(temp,n,imMat2),deltalambda);
    vec2.add( bj.vlambda,bj.vlambda, temp);

    // Add to angular velocity
    bi.wlambda -= bi.invInertia * this.rixn * deltalambda;
    bj.wlambda += bj.invInertia * this.rjxn * deltalambda;
};

