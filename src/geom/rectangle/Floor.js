/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * Rounds down (floors) the top left X and Y co-ordinates of the given Rectangle to the largest integer less than or equal to them
 *
 * @function Phaser.Geom.Rectangle.Floor
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The rectangle to floor the top left X and Y co-ordinates of
 *
 * @return {Phaser.Geom.Rectangle} The rectangle that was passed to this function with its co-ordinates floored.
 */
var Floor = function (rect)
{
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);

    return rect;
};

module.exports = Floor;
