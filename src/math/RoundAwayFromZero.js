/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.RoundAwayFromZero
 * @since 3.0.0
 *
 * @param {number} value - [description]
 *
 * @return {number} [description]
 */
var RoundAwayFromZero = function (value)
{
    // "Opposite" of truncate.
    return (value > 0) ? Math.ceil(value) : Math.floor(value);
};

module.exports = RoundAwayFromZero;
