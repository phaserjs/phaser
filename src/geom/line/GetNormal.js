/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var MATH_CONST = require('../../math/const');
var Angle = require('./Angle');
var Point = require('../point/Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Line.GetNormal
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Line} line - [description]
 * @param {Phaser.Geom.Point|object} [out] - [description]
 *
 * @return {Phaser.Geom.Point|object} [description]
 */
var GetNormal = function (line, out)
{
    if (out === undefined) { out = new Point(); }

    var a = Angle(line) - MATH_CONST.TAU;

    out.x = Math.cos(a);
    out.y = Math.sin(a);

    return out;
};

module.exports = GetNormal;
