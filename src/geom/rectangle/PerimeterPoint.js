/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2018 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */

var Point = require('../point/Point');
var DegToRad = require('../../math/DegToRad');

/**
 * [description]
 *
 * @function Phaser.Geom.Rectangle.PerimeterPoint
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Rectangle} rectangle - [description]
 * @param {integer} angle - [description]
 * @param {Phaser.Geom.Point} [out] - [description]
 *
 * @return {Phaser.Geom.Point} [description]
 */
var PerimeterPoint = function (rectangle, angle, out)
{
    if (out === undefined) { out = new Point(); }

    angle = DegToRad(angle);

    var s = Math.sin(angle);
    var c = Math.cos(angle);

    var dx = (c > 0) ? rectangle.width / 2 : rectangle.width / -2;
    var dy = (s > 0) ? rectangle.height / 2 : rectangle.height / -2;

    if (Math.abs(dx * s) < Math.abs(dy * c))
    {
        dy = (dx * s) / c;
    }
    else
    {
        dx = (dy * c) / s;
    }

    out.x = dx + rectangle.centerX;
    out.y = dy + rectangle.centerY;

    return out;
};

module.exports = PerimeterPoint;
