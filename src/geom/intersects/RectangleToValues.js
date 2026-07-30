/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2026 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Checks if a Rectangle intersects with a region defined by explicit left, right, top, and bottom boundary values.
 *
 * @function Phaser.Geom.Intersects.RectangleToValues
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The Rectangle to check for intersection.
 * @param {number} left - The x coordinate of the left edge of the region to check against.
 * @param {number} right - The x coordinate of the right edge of the region to check against.
 * @param {number} top - The y coordinate of the top edge of the region to check against.
 * @param {number} bottom - The y coordinate of the bottom edge of the region to check against.
 * @param {number} [tolerance=0] - Tolerance allowed in the calculation, expressed in pixels.
 *
 * @return {boolean} Returns true if there is an intersection.
 */
var RectangleToValues = function (rect, left, right, top, bottom, tolerance)
{
    if (tolerance === undefined) { tolerance = 0; }

    return !(
        left > rect.right + tolerance ||
        right < rect.left - tolerance ||
        top > rect.bottom + tolerance ||
        bottom < rect.top - tolerance
    );
};

module.exports = RectangleToValues;
