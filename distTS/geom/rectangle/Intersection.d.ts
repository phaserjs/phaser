/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
declare var Rectangle: any;
declare var Intersects: any;
/**
 * Takes two Rectangles and first checks to see if they intersect.
 * If they intersect it will return the area of intersection in the `out` Rectangle.
 * If they do not intersect, the `out` Rectangle will have a width and height of zero.
 *
 * @function Phaser.Geom.Rectangle.Intersection
 * @since 3.11.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to get the intersection from.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to get the intersection from.
 * @param {Phaser.Geom.Rectangle} [out] - A Rectangle to store the intersection results in.
 *
 * @return {Phaser.Geom.Rectangle} The intersection result. If the width and height are zero, no intersection occurred.
 */
declare var Intersection: (rectA: any, rectB: any, out: any) => any;
