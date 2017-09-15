
var Vector3 = require('../math/Vector3');
var Matrix4 = require('../math/Matrix4');
var Quaternion = require('../math/Quaternion');

var tmpMat4 = new Matrix4();
var tmpQuat = new Quaternion();
var tmpVec3 = new Vector3();

var util = {};

/**
 * Rotates a vector in place by axis angle.
 *
 * This is the same as transforming a point by an 
 * axis-angle quaternion, but it has higher precision.
 * 
 * @param  {Vector3} vec     [description]
 * @param  {Vector3} axis    [description]
 * @param  {float} radians [description]
 * @return {Vector3}         [description]
 */
util.rotate = function(vec, axis, radians) {
    //set the quaternion to our axis angle
    tmpQuat.setAxisAngle(axis, radians);

    //create a rotation matrix from the axis angle
    tmpMat4.fromRotationTranslation( tmpQuat, tmpVec3.set(0, 0, 0) );

    //multiply our vector by the rotation matrix
    return vec.transformMat4( tmpMat4 );
};

module.exports = util;