/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Snap.Ceil
 * @since 3.0.0
 *
 * @param {number} value - [description]
 * @param {number} gap - [description]
 * @param {number} [start=0] - [description]
 *
 * @return {number} [description]
 */
var SnapCeil = function (value, gap, start)
{
    if (start === undefined) { start = 0; }

    if (gap === 0)
    {
        return value;
    }

    value -= start;
    value = gap * Math.ceil(value / gap);

    return start + value;
};

module.exports = SnapCeil;
