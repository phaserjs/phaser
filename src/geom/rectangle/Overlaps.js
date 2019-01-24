/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Checks if two Rectangles overlap. If a Rectangle is within another Rectangle, the two will be considered overlapping. Thus, the Rectangles are treated as "solid".
 *
 * @function Phaser.Geom.Rectangle.Overlaps
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first Rectangle to check.
 * @param {Phaser.Geom.Rectangle} rectB - The second Rectangle to check.
 *
 * @return {boolean} `true` if the two Rectangles overlap, `false` otherwise.
 */
var Overlaps = function (rectA, rectB)
{
    return (
        rectA.x < rectB.right &&
        rectA.right > rectB.x &&
        rectA.y < rectB.bottom &&
        rectA.bottom > rectB.y
    );
};

module.exports = Overlaps;
