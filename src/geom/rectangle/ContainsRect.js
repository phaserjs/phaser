/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Tests if one rectangle fully contains another. A rectangle is considered fully contained
 * if all four of its edges (left, right, top, and bottom) lie strictly within the bounds
 * of the outer rectangle. Rectangles that merely touch or overlap are not considered contained.
 *
 * @function Phaser.Geom.Rectangle.ContainsRect
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectA - The outer rectangle to test as the container.
 * @param {Phaser.Geom.Rectangle} rectB - The inner rectangle to test for full containment within rectA.
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
