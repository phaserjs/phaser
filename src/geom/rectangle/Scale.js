/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

// Scales the width and height of this Rectangle by the given amounts.

/**
 * Scales the width and height of this Rectangle by the given amounts.
 *
 * @function Phaser.Geom.Rectangle.Scale
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Rectangle} O - [rect,$return]
 *
 * @param {Phaser.Geom.Rectangle} rect - The `Rectangle` object that will be scaled by the specified amount(s).
 * @param {number} x - The factor by which to scale the rectangle horizontally.
 * @param {number} y - The amount by which to scale the rectangle vertically. If this is not specified, the rectangle will be scaled by the factor `x` in both directions.
 *
 * @return {Phaser.Geom.Rectangle} The rectangle object with updated `width` and `height` properties as calculated from the scaling factor(s).
 */
var Scale = function (rect, x, y)
{
    if (y === undefined) { y = x; }

    rect.width *= x;
    rect.height *= y;

    return rect;
};

module.exports = Scale;
