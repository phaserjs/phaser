/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Using Bresenham's line algorithm this will return an array of all coordinates on this line.
 *
 * The `start` and `end` points are rounded before this runs as the algorithm works on integers.
 *
 * @function Phaser.Geom.Line.BresenhamPoints
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The line.
 * @param {integer} [stepRate=1] - The optional step rate for the points on the line.
 * @param {array} [results] - An optional array to push the resulting coordinates into.
 *
 * @return {object[]} The array of coordinates on the line.
 */
declare var BresenhamPoints: any;
