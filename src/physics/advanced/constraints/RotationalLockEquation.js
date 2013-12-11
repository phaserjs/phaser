var Equation = require("./Equation"),
    vec2 = require('../math/vec2');

module.exports = RotationalLockEquation;

/**
 * Locks the relative angle between two bodies. The constraint tries to keep the dot product between two vectors, local in each body, to zero. The local angle in body i is a parameter.
 *
 * @class RotationalLockEquation
 * @constructor
 * @extends Equation
 * @param {Body} bi
 * @param {Body} bj
 * @param {Object} options
 * @param {Number} options.angle Angle to add to the local vector in body i.
 */
function RotationalLockEquation(bi,bj,options){
    options = options || {};
    Equation.call(this,bi,bj,-Number.MAX_VALUE,Number.MAX_VALUE);
    this.angle = options.angle || 0;

    var G = this.G;
    G[2] =  1;
    G[5] = -1;
};
RotationalLockEquation.prototype = new Equation();
RotationalLockEquation.prototype.constructor = RotationalLockEquation;

var worldVectorA = vec2.create(),
    worldVectorB = vec2.create(),
    xAxis = vec2.fromValues(1,0),
    yAxis = vec2.fromValues(0,1);
RotationalLockEquation.prototype.computeGq = function(){
    vec2.rotate(worldVectorA,xAxis,this.bi.angle+this.angle);
    vec2.rotate(worldVectorB,yAxis,this.bj.angle);
    return vec2.dot(worldVectorA,worldVectorB);
};
