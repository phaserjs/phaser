/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if two Rectangles intersect.
 *
 * A Rectangle intersects another Rectangle if any part of its bounds is within the other Rectangle's bounds. As such, the two Rectangles are considered "solid". A Rectangle with no width or no height will never intersect another Rectangle.
 *
 * @function Phaser.Geom.Intersects.RectangleToRectangle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to check for intersection.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to check for intersection.
 *
 * @return {boolean} `true` if the two Rectangles intersect, otherwise `false`.
 */
var RectangleToRectangle = function (rectA, rectB)
{
    if (rectA.width <= 0 || rectA.height <= 0 || rectB.width <= 0 || rectB.height <= 0)
    {
        return false;
    }

    return !(rectA.right < rectB.x || rectA.bottom < rectB.y || rectA.x > rectB.right || rectA.y > rectB.bottom);
};

module.exports = RectangleToRectangle;
