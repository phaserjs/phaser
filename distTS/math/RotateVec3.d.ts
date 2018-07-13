/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Vector3: any;
declare var Matrix4: any;
declare var Quaternion: any;
declare var tmpMat4: any;
declare var tmpQuat: any;
declare var tmpVec3: any;
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
declare var RotateVec3: any;
