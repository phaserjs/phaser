/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2019 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.NormalX
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - The Line object to get the normal value from.
 *
 * @return {number} [description]
 */
var NormalX = function (line)
{
    return Math.cos(Angle(line) - MATH_CONST.TAU);
};

module.exports = NormalX;
