/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013-2023 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Rounds down (floors) the top left X and Y coordinates of the given Rectangle to the largest integer less than or equal to them
 *
 * @function Phaser.Geom.Rectangle.Floor
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to floor the top left X and Y coordinates of
 *
 * @return {Phaser.Geom.Rectangle} The rectangle that was passed to this function with its coordinates floored.
 */
var Floor = function (rect)
{
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);

    return rect;
};

module.exports = Floor;
