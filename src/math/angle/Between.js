/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

/**
 * [description]
 *
 * @function Phaser.Math.Angle.Between
 * @since 3.0.0
 *
 * @param {number} x1 - [description]
 * @param {number} y1 - [description]
 * @param {number} x2 - [description]
 * @param {number} y2 - [description]
 *
 * @return {number} [description]
 */
var Between = function (x1, y1, x2, y2)
{
    return Math.atan2(y2 - y1, x2 - x1);
};

module.exports = Between;
