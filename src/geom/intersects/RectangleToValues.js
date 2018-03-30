/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Intersects.RectangleToValues
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {number} left - [description]
 * @param {number} right - [description]
 * @param {number} top - [description]
 * @param {number} bottom - [description]
 * @param {float} [tolerance=0] - [description]
 *
 * @return {boolean} [description]
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
