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
    Equation.call(this,bi,bj,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.relativeVelocity = 1;
    this.ratio = 1;
};
RotationalVelocityEquation.prototype = new Equation();
RotationalVelocityEquation.prototype.constructor = RotationalVelocityEquation;
RotationalVelocityEquation.prototype.computeB = function(a,b,h){
    var G = this.G;
    G[2] = -1;
    G[5] = this.ratio;

    var GiMf = this.computeGiMf();
    var GW = this.computeGW() + this.relativeVelocity;
    var B = - GW * b - h*GiMf;

    return B;
};
