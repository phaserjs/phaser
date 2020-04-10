/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compares the `x`, `y`, `width` and `height` properties of two rectangles.
 *
 * @function Phaser.Geom.Rectangle.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - Rectangle A
 * @param {Phaser.Geom.Rectangle} toCompare - Rectangle B
 *
 * @return {boolean} `true` if the rectangles' properties are an exact match, otherwise `false`.
 */
var Equals = function (rect, toCompare)
{
    return (
        rect.x === toCompare.x &&
        rect.y === toCompare.y &&
        rect.width === toCompare.width &&
        rect.height === toCompare.height
    );
};

module.exports = Equals;
