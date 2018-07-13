/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Find the angle of a segment from (point1.x, point1.y) -> (point2.x, point2.y).
 *
 * The difference between this method and {@link Phaser.Math.Angle.BetweenPoints} is that this assumes the y coordinate
 * travels down the screen.
 *
 * @function Phaser.Math.Angle.BetweenPointsY
 * @since 3.0.0
 *
 * @param {(Phaser.Geom.Point|object)} point1 - The first point.
 * @param {(Phaser.Geom.Point|object)} point2 - The second point.
 *
 * @return {number} The angle in radians.
 */
declare var BetweenPointsY: (point1: any, point2: any) => number;
