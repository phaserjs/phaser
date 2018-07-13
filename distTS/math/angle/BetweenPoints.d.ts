/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * Calculates the angle of the vector from the first point to the second point.
 *
 * @function Phaser.Math.Angle.BetweenPoints
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point1 - The first point.
 * @param {(Phaser.Geom.Point|object)} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
declare var BetweenPoints: (point1: any, point2: any) => number;
