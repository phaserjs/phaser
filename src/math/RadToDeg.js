/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var CONST = require('./const');

/**
 * Convert the given angle in radians, to the equivalent angle in degrees.
 *
 * @function Phaser.Math.RadToDeg
 * @since 3.0.0
 *
 * @param {number} radians - The angle in radians to convert ot degrees.
 *
 * @return {integer} The given angle converted to degrees.
 */
var RadToDeg = function (radians)
{
    return radians * CONST.RAD_TO_DEG;
};

module.exports = RadToDeg;
