/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Check if rectangle intersects with values.
 *
 * @function Phaser.Geom.Intersects.RectangleToValues
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The rectangle object
 * @param {number} left - The x coordinate of the left of the Rectangle.
 * @param {number} right - The x coordinate of the right of the Rectangle.
 * @param {number} top - The y coordinate of the top of the Rectangle.
 * @param {number} bottom - The y coordinate of the bottom of the Rectangle.
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
