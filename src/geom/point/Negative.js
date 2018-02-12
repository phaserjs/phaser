/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('./Point');

/**
 * [description]
 *
 * @function Phaser.Geom.Point.Negative
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Point} point - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var Negative = function (point, out)
{
    if (out === undefined) { out = new Point(); }

    return out.setTo(-point.x, -point.y);
};

module.exports = Negative;
