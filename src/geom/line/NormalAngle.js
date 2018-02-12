/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MATH_CONST = require('../../math/const');
var Wrap = require('../../math/Wrap');
var Angle = require('./Angle');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.NormalAngle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 *
 * @return {number} [description]
 */
var NormalAngle = function (line)
{
    var angle = Angle(line) - MATH_CONST.TAU;

    return Wrap(angle, -Math.PI, Math.PI);
};

module.exports = NormalAngle;
