/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var Vector3 = require('../math/Vector3');
var Matrix4 = require('../math/Matrix4');
var Quaternion = require('../math/Quaternion');

var tmpMat4 = new Matrix4();
var tmpQuat = new Quaternion();
var tmpVec3 = new Vector3();

/**
 * Rotates a vector in place by axis angle.
 *
 * This is the same as transforming a point by an
 * axis-angle quaternion, but it has higher precision.
 *
 * @function Phaser.Math.RotateVec3
 * @since 3.0.0
 *
 * @param {Phaser.Math.Vector3} vec - The vector to be rotated.
 * @param {Phaser.Math.Vector3} axis - The axis to rotate around.
 * @param {number} radians - The angle of rotation in radians.
 *
 * @return {Phaser.Math.Vector3} The given vector.
 */
var RotateVec3 = function (vec, axis, radians)
{
    //  Set the quaternion to our axis angle
    tmpQuat.setAxisAngle(axis, radians);

    //  Create a rotation matrix from the axis angle
    tmpMat4.fromRotationTranslation(tmpQuat, tmpVec3.set(0, 0, 0));

    //  Multiply our vector by the rotation matrix
    return vec.transformMat4(tmpMat4);
};

module.exports = RotateVec3;
