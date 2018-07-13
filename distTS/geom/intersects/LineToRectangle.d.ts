/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
/**
 * Checks for intersection between the Line and a Rectangle shape, or a rectangle-like
 * object, with public `x`, `y`, `right` and `bottom` properties, such as a Sprite or Body.
 *
 * An intersection is considered valid if:
 *
 * The line starts within, or ends within, the Rectangle.
 * The line segment intersects one of the 4 rectangle edges.
 *
 * The for the purposes of this function rectangles are considered 'solid'.
 *
 * @function Phaser.Geom.Intersects.LineToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {(Phaser.Geom.Rectangle|object)} rect - [description]
 *
 * @return {boolean} [description]
 */
declare var LineToRectangle: (line: any, rect: any) => boolean;
