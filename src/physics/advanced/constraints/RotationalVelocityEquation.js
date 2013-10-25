var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = RotationalVelocityEquation;

/**
 * Syncs rotational velocity of two bodies, or sets a relative velocity (motor).
 *
 * @class RotationalVelocityEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 */
function RotationalVelocityEquation(bi,bj){
    Equation.call(this,bi,bj,-1e6,1e6);
    this.relativeVelocity = 1;
    this.ratio = 1;
};
RotationalVelocityEquation.prototype = new Equation();
RotationalVelocityEquation.prototype.constructor = RotationalVelocityEquation;
RotationalVelocityEquation.prototype.computeB = function(a,b,h){
    var bi = this.bi,
        bj = this.bj,
        vi = bi.velocity,
        wi = bi.angularVelocity,
        taui = bi.angularForce,
        vj = bj.velocity,
        wj = bj.angularVelocity,
        tauj = bj.angularForce,
        invIi = bi.invInertia,
        invIj = bj.invInertia,
        Gq = 0,
        GW = this.ratio * wj - wi + this.relativeVelocity,
        GiMf = invIj*tauj - invIi*taui;

    var B = - Gq * a - GW * b - h*GiMf;

    return B;
};

// Compute C = GMG+eps in the SPOOK equation
RotationalVelocityEquation.prototype.computeC = function(eps){
    var bi = this.bi,
        bj = this.bj;

    var C = bi.invInertia + bj.invInertia + eps;

    return C;
};
var computeGWlambda_ulambda = vec2.create();
RotationalVelocityEquation.prototype.computeGWlambda = function(){
    var bi = this.bi,
        bj = this.bj;

    var GWlambda = bj.wlambda - bi.wlambda;

    return GWlambda;
};

var addToWlambda_temp = vec2.create();
RotationalVelocityEquation.prototype.addToWlambda = function(deltalambda){
    var bi = this.bi,
        bj = this.bj;

    // Add to angular velocity
    bi.wlambda -= bi.invInertia * deltalambda;
    bj.wlambda += bj.invInertia * deltalambda;
};

