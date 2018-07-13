/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Vector2: any;
/**
 * Takes the `x` and `y` coordinates and transforms them into the same space as
 * defined by the position, rotation and scale values.
 *
 * @function Phaser.Math.TransformXY
 * @since 3.0.0
 *
 * @param {number} x - The x coordinate to be transformed.
 * @param {number} y - The y coordinate to be transformed.
 * @param {number} positionX - Horizontal position of the transform point.
 * @param {number} positionY - Vertical position of the transform point.
 * @param {number} rotation - Rotation of the transform point, in radians.
 * @param {number} scaleX - Horizontal scale of the transform point.
 * @param {number} scaleY - Vertical scale of the transform point.
 * @param {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} [output] - The output vector, point or object for the translated coordinates.
 *
 * @return {(Phaser.Math.Vector2|Phaser.Geom.Point|object)} The translated point.
 */
declare var TransformXY: any;
