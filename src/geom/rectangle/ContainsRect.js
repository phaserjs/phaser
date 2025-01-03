/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tests if one rectangle fully contains another.
 *
 * @function Phaser.Geom.Rectangle.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The first rectangle.
 * @param {Phaser.Geom.Rectangle} rectB - The second rectangle.
 *
 * @return {boolean} True only if rectA fully contains rectB.
 */
var ContainsRect = function (rectA, rectB)
{
    //  Volume check (if rectB volume > rectA then rectA cannot contain it)
    if ((rectB.width * rectB.height) > (rectA.width * rectA.height))
    {
        return false;
    }

    return (
        (rectB.x > rectA.x && rectB.x < rectA.right) &&
        (rectB.right > rectA.x && rectB.right < rectA.right) &&
        (rectB.y > rectA.y && rectB.y < rectA.bottom) &&
        (rectB.bottom > rectA.y && rectB.bottom < rectA.bottom)
    );
};

module.exports = ContainsRect;
