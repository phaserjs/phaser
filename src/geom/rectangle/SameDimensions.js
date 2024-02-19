/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2024 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

/**
 * Determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
 *
 * @function Phaser.Geom.Rectangle.SameDimensions
 * @since 3.15.0
 *
 * @param {Phaser.Geom.Rectangle} rect - The first Rectangle object.
 * @param {Phaser.Geom.Rectangle} toCompare - The second Rectangle object.
 *
 * @return {boolean} `true` if the objects have equivalent values for the `width` and `height` properties, otherwise `false`.
 */
var SameDimensions = function (rect, toCompare)
{
    return (rect.width === toCompare.width && rect.height === toCompare.height);
};

module.exports = SameDimensions;
