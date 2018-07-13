/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Circumference: (circle: any) => number;
declare var CircumferencePoint: (circle: any, angle: any, out: any) => any;
declare var FromPercent: any;
declare var MATH_CONST: any;
/**
 * Returns an array of Point objects containing the coordinates of the points around the circumference of the Ellipse,
 * based on the given quantity or stepRate values.
 *
 * @function Phaser.Geom.Ellipse.GetPoints
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point[]} O - [out,$return]
 *
 * @param {Phaser.Geom.Ellipse} ellipse - The Ellipse to get the points from.
 * @param {integer} quantity - The amount of points to return. If a falsey value the quantity will be derived from the `stepRate` instead.
 * @param {number} [stepRate] - Sets the quantity by getting the circumference of the ellipse and dividing it by the stepRate.
 * @param {(array|Phaser.Geom.Point[])} [out] - An array to insert the points in to. If not provided a new array will be created.
 *
 * @return {(array|Phaser.Geom.Point[])} An array of Point objects pertaining to the points around the circumference of the ellipse.
 */
declare var GetPoints: any;
