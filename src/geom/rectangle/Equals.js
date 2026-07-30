/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Compares the `x`, `y`, `width` and `height` properties of two rectangles.
 * Returns `true` only if all four values match exactly using strict equality.
 * This function does not consider rectangles with the same area but different
 * positions or dimensions to be equal.
 *
 * @function Phaser.Geom.Rectangle.Equals
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The first rectangle to compare.
 * @param {Phaser.Geom.Rectangle} toCompare - The second rectangle to compare against.
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
