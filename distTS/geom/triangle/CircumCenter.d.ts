/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Vector2: any;
/**
 * Computes the determinant of a 2x2 matrix. Uses standard double-precision arithmetic, so is susceptible to round-off error.
 *
 * @function det
 * @private
 * @since 3.0.0
 *
 * @param {number} m00 - The [0,0] entry of the matrix.
 * @param {number} m01 - The [0,1] entry of the matrix.
 * @param {number} m10 - The [1,0] entry of the matrix.
 * @param {number} m11 - The [1,1] entry of the matrix.
 *
 * @return {number} the determinant.
 */
declare function det(m00: any, m01: any, m10: any, m11: any): number;
/**
 * Computes the circumcentre of a triangle. The circumcentre is the centre of
 * the circumcircle, the smallest circle which encloses the triangle. It is also
 * the common intersection point of the perpendicular bisectors of the sides of
 * the triangle, and is the only point which has equal distance to all three
 * vertices of the triangle.
 *
 * @function Phaser.Geom.Triangle.CircumCenter
 * @since 3.0.0
 *
 * @generic {Phaser.Math.Vector2} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - [description]
 * @param {Phaser.Math.Vector2} [out] - [description]
 *
 * @return {Phaser.Math.Vector2} [description]
 */
declare var CircumCenter: (triangle: any, out: any) => any;
