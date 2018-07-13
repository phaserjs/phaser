/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.Decompose
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rect - [description]
 * @param {array} [out] - [description]
 *
 * @return {array} [description]
 */
var Decompose = function (rect, out)
{
    if (out === undefined) { out = []; }

    out.push({ x: rect.x, y: rect.y });
    out.push({ x: rect.right, y: rect.y });
    out.push({ x: rect.right, y: rect.bottom });
    out.push({ x: rect.x, y: rect.bottom });

    return out;
};

module.exports = Decompose;
